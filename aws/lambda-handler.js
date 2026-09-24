// ===== AWS Lambda handler: S3 event -> idempotent DynamoDB write =====
// This is the CODE that runs when a file lands in S3. S3 fires an event,
// Lambda receives it, and writes the file's metadata to DynamoDB.
//
// Key point: S3 events can fire MORE THAN ONCE (at-least-once delivery), so the
// write must be IDEMPOTENT — a conditional put that won't create a duplicate row.
//
// Run the local demo:  node lambda-handler.js
// (mocks DynamoDB so it runs standalone — shows the duplicate-event being ignored)

// --- the real DynamoDB write would use the AWS SDK; here we mock it to run offline ---
const db = new Map(); // stand-in for the DynamoDB "files" table (key = fileId)

async function putItemIdempotent(item) {
  // mimics DynamoDB PutItem with ConditionExpression "attribute_not_exists(fileId)"
  // -> the write only succeeds if the row doesn't already exist
  if (db.has(item.fileId)) {
    const err = new Error('ConditionalCheckFailedException');
    err.name = 'ConditionalCheckFailedException';
    throw err;
  }
  db.set(item.fileId, item);
}

// ---- THE LAMBDA HANDLER ----
// AWS calls this with an `event` describing the S3 records that triggered it.
exports.handler = async (event) => {
  const results = [];

  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const fileId = decodeURIComponent(record.s3.object.key);
    const size = record.s3.object.size;

    const item = { fileId, bucket, sizeBytes: size, processedAt: '2026-09-25' };

    try {
      await putItemIdempotent(item); // idempotent write
      results.push({ fileId, status: 'written' });
    } catch (e) {
      if (e.name === 'ConditionalCheckFailedException') {
        // duplicate S3 event for a file we already processed -> safely skip
        results.push({ fileId, status: 'skipped (already processed)' });
      } else {
        throw e; // real error -> let Lambda retry
      }
    }
  }

  return { processed: results };
};

// ================= local demo (mock S3 event, fired TWICE) =================
if (require.main === module) {
  const mockEvent = {
    Records: [
      { s3: { bucket: { name: 'uploads' }, object: { key: 'invoice-123.txt', size: 42 } } },
    ],
  };

  (async () => {
    console.log('1st event:', (await exports.handler(mockEvent)).processed);
    console.log('2nd event (duplicate):', (await exports.handler(mockEvent)).processed);
    console.log('\n→ DB rows:', [...db.keys()], '(only ONE, despite two events) ✅');
  })();
}
