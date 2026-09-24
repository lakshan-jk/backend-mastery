// ===== URL Shortener with MongoDB =====
// Same shorten + redirect, but stored in MongoDB instead of an in-memory Map.
//
// Setup:  npm install express mongodb
//         (need Mongo running:  mongod   OR use a MongoDB Atlas connection string)
// Run:    node server-mongo.js   -> http://localhost:4602
//
// Try:
//   curl -X POST localhost:4602/shorten -H "Content-Type: application/json" -d '{"url":"https://example.com/bedsheet"}'
//   curl -i localhost:4602/<code>          -> 302 redirect
//   curl localhost:4602/<code>/stats

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const MONGO_URL = 'mongodb://localhost:27017';
let urls; // will hold the "urls" collection

// ---- connect to Mongo once at startup ----
async function connectDB() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  const db = client.db('shortener'); // database name
  urls = db.collection('urls'); // collection (like a table)
  // index on "code" so lookups are fast + codes stay unique
  await urls.createIndex({ code: 1 }, { unique: true });
  console.log('✅ connected to MongoDB');
}

const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const makeCode = (len = 5) =>
  Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');

// ---- SHORTEN (write) — insert a document ----
app.post('/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url is required' });

  const code = makeCode();
  // a Mongo "document" = a JSON-like object
  await urls.insertOne({ code, url, clicks: 0, createdAt: new Date() });

  res.json({ code, shortUrl: `http://localhost:4602/${code}` });
});

// ---- REDIRECT (read) — find the document by code ----
app.get('/:code', async (req, res) => {
  // findOne = get the first doc matching this filter
  const doc = await urls.findOne({ code: req.params.code });
  if (!doc) return res.status(404).json({ error: 'not found' });

  // $inc = atomically add 1 to clicks (Mongo does this on the server, safe under concurrency)
  await urls.updateOne({ code: req.params.code }, { $inc: { clicks: 1 } });

  res.redirect(302, doc.url);
});

// ---- STATS ----
app.get('/:code/stats', async (req, res) => {
  const doc = await urls.findOne({ code: req.params.code });
  if (!doc) return res.status(404).json({ error: 'not found' });
  res.json({ code: doc.code, url: doc.url, clicks: doc.clicks });
});

// start server only after DB is connected
connectDB()
  .then(() =>
    app.listen(4602, () => console.log('🔗 mongo URL shortener on http://localhost:4602')),
  )
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });
