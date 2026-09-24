// ===== ONE Lambda for the whole S3 lifecycle (create + delete) =====
// Instead of a separate Lambda per event type, a SINGLE function routes on the
// event name (the "flag") — cleaner: one deployment, one IAM role, shared code.
//
//   ObjectCreated  -> classify by format + IDEMPOTENT write (conditional put)
//   ObjectRemoved  -> clean up the metadata row
//
// Run:  node s3-unified-handler.js   (mocks the DB; fires create/duplicate/delete)

const db = new Map(); // stand-in for DynamoDB (key = fileId)

// ---- idempotent write: only creates the row if it doesn't already exist ----
function putIfAbsent(item) {
  if (db.has(item.fileId)) {
    const e = new Error("ConditionalCheckFailedException");
    e.name = "ConditionalCheckFailedException";
    throw e; // DynamoDB: PutItem with ConditionExpression attribute_not_exists(fileId)
  }
  db.set(item.fileId, item);
}

// ---- classify by extension (prefer Content-Type metadata in real life) ----
function classify(fileId) {
  const ext = fileId.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (["pdf", "doc", "docx", "txt"].includes(ext)) return "document";
  if (["csv", "json", "xlsx"].includes(ext)) return "data";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  return "other";
}

// ---- THE single handler: routes on the event type ----
exports.handler = async (event) => {
  const results = [];

  for (const record of event.Records) {
    const eventName = record.eventName;               // the routing "flag"
    const fileId = decodeURIComponent(record.s3.object.key);

    if (eventName.startsWith("ObjectCreated")) {
      const type = classify(fileId);
      try {
        putIfAbsent({ fileId, type });                // idempotent
        results.push({ fileId, event: "created", type, status: "written" });
      } catch (e) {
        if (e.name === "ConditionalCheckFailedException") {
          results.push({ fileId, event: "created", status: "skipped (duplicate)" });
        } else {
          throw e; // real error -> let Lambda retry
        }
      }

    } else if (eventName.startsWith("ObjectRemoved")) {
      db.delete(fileId);
      results.push({ fileId, event: "removed", status: "metadata deleted" });
    }
  }

  return results;
};

// ================= local demo =================
if (require.main === module) {
  const ev = (name, key) => ({ eventName: name, s3: { object: { key } } });
  const event = { Records: [
    ev("ObjectCreated:Put", "vacation.jpg"),   // create (image)
    ev("ObjectCreated:Put", "vacation.jpg"),   // duplicate event -> skipped (idempotent)
    ev("ObjectCreated:Put", "report.pdf"),     // create (document)
    ev("ObjectRemoved:Delete", "report.pdf"),  // delete -> cleanup
  ]};

  exports.handler(event).then((res) => {
    console.log(JSON.stringify(res, null, 2));
    console.log("\n→ DB rows:", [...db.keys()], "(one Lambda handled create + delete) ✅");
  });
}
