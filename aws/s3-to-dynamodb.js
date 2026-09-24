// ===== AWS hands-on: S3 -> DynamoDB pattern (via LocalStack, FREE) =====
// The interview pattern: a file lands in S3, we write its metadata to DynamoDB.
// Run:  node s3-to-dynamodb.js   (LocalStack must be running on :4566)

const {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');

const {
  DynamoDBClient,
  CreateTableCommand,
  PutItemCommand,
  GetItemCommand,
} = require('@aws-sdk/client-dynamodb');

// --- point the SDK at LocalStack (instead of real AWS) ---
const config = {
  region: 'us-east-1',
  endpoint: 'http://localhost:4566', // LocalStack, not real AWS
  credentials: { accessKeyId: 'test', secretAccessKey: 'test' }, // LocalStack accepts anything
  forcePathStyle: true, // needed for S3 on LocalStack
};

const s3 = new S3Client(config);
const dynamo = new DynamoDBClient(config);

const BUCKET = 'my-uploads';
const TABLE = 'FileMetadata';

async function main() {
  // 1) Create an S3 bucket
  try {
    await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
    console.log('✅ S3 bucket created:', BUCKET);
  } catch (e) {
    console.log('(bucket may already exist)', e.name);
  }

  // 2) Create a DynamoDB table (partition key = fileId)
  try {
    await dynamo.send(
      new CreateTableCommand({
        TableName: TABLE,
        KeySchema: [{ AttributeName: 'fileId', KeyType: 'HASH' }], // HASH = partition key
        AttributeDefinitions: [{ AttributeName: 'fileId', AttributeType: 'S' }], // S = String
        BillingMode: 'PAY_PER_REQUEST',
      }),
    );
    console.log('✅ DynamoDB table created:', TABLE);
  } catch (e) {
    console.log('(table may already exist)', e.name);
  }

  // 3) "Upload" a file to S3
  const fileId = 'invoice-123.txt';
  const fileBody = 'Hello from Lakshan — this is my uploaded file!';
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: fileId, Body: fileBody }));
  console.log('✅ file uploaded to S3:', fileId);

  // 4) Write the file's METADATA to DynamoDB (this is what a Lambda would do)
  await dynamo.send(
    new PutItemCommand({
      TableName: TABLE,
      Item: {
        fileId: { S: fileId }, // partition key
        bucket: { S: BUCKET },
        sizeBytes: { N: String(fileBody.length) },
        uploadedBy: { S: 'lakshan' },
        uploadedAt: { S: '2026-09-14' },
      },
    }),
  );
  console.log('✅ metadata written to DynamoDB');

  // 5) Read the metadata back to verify
  const result = await dynamo.send(
    new GetItemCommand({ TableName: TABLE, Key: { fileId: { S: fileId } } }),
  );
  console.log('📄 metadata read back from DynamoDB:');
  console.log(JSON.stringify(result.Item, null, 2));

  console.log('\n🎉 S3 -> DynamoDB pattern complete (all on LocalStack, free)!');
}

main().catch((err) => {
  console.error('❌ error:', err);
  process.exit(1);
});
