// ===== URL Shortener — WITH Redis caching + Redis click counters =====
// Adds to the basic version:
//   - REDIRECT reads from Redis first (cache-aside); DB only on a miss
//   - CLICKS are counted in Redis with INCR (fast), not the DB
//   - a background job flushes click counts to the "DB" every 10s (batch write)
//
// Run:  npm install express ioredis && node server-cached.js  -> http://localhost:4601
// (needs Redis running:  redis-cli ping  -> PONG)

const express = require('express');
const Redis = require('ioredis');
const app = express();
app.use(express.json());
const redis = new Redis(); // connects to localhost:6379

// ---- our "database" (pretend this is Postgres; slow disk lookups) ----
const db = new Map(); // code -> { url, clicks }
function dbGet(code) {
  return db.get(code);
}
function dbCreate(code, url) {
  db.set(code, { url, clicks: 0 });
}

const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const makeCode = (len = 5) =>
  Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');

// ---- SHORTEN (write) ----
app.post('/shorten', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url is required' });

  let code;
  do {
    code = makeCode();
  } while (db.has(code));
  dbCreate(code, url);

  res.json({ code, shortUrl: `http://localhost:4601/${code}` });
});

// ---- REDIRECT (read) — cache-aside + INCR counter ----
app.get('/:code', async (req, res) => {
  const code = req.params.code;

  // 1) try Redis first
  let url = await redis.get(`url:${code}`);
  let source = 'redis (HIT)';

  // 2) miss -> hit the DB, then backfill Redis
  if (!url) {
    const entry = dbGet(code);
    if (!entry) return res.status(404).json({ error: 'not found' });
    url = entry.url;
    await redis.set(`url:${code}`, url, 'EX', 3600); // cache 1 hour
    source = 'db (MISS -> cached)';
  }

  // 3) count the click in Redis (fast, in-memory) — NOT the DB
  await redis.incr(`clicks:${code}`);

  // (for the demo, tell us where it came from via a header instead of a real browser redirect)
  res.set('X-Served-By', source);
  res.redirect(302, url);
});

// ---- STATS: live count = DB base + pending Redis counter ----
app.get('/:code/stats', async (req, res) => {
  const code = req.params.code;
  const entry = dbGet(code);
  if (!entry) return res.status(404).json({ error: 'not found' });
  const pending = Number(await redis.get(`clicks:${code}`)) || 0;
  res.json({
    code,
    url: entry.url,
    dbClicks: entry.clicks,
    pendingInRedis: pending,
    total: entry.clicks + pending,
  });
});

// ---- BACKGROUND JOB: flush Redis click counts -> DB every 10s (batch write) ----
setInterval(async () => {
  const keys = await redis.keys('clicks:*');
  for (const key of keys) {
    const code = key.split(':')[1];
    const count = Number(await redis.get(key)) || 0;
    if (count > 0 && db.has(code)) {
      db.get(code).clicks += count; // one batched write per code
      await redis.del(key); // reset the pending counter
      console.log(`flushed ${count} clicks -> DB for ${code}`);
    }
  }
}, 10000);

app.listen(4601, () => console.log('🔗 cached URL shortener on http://localhost:4601'));
