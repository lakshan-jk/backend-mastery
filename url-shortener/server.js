// ===== URL Shortener =====
// Two operations:
//   1) SHORTEN:  POST /shorten { url }  -> returns a short code
//   2) REDIRECT: GET  /:code            -> 302 redirect to the original URL
//
// Run:  npm install express && node server.js   -> http://localhost:4600
//
// Try it:
//   curl -X POST localhost:4600/shorten -H "Content-Type: application/json" -d '{"url":"https://example.com/products/blue-bedsheet"}'
//   -> { "shortUrl": "http://localhost:4600/aB3x9", "code": "aB3x9" }
//   open http://localhost:4600/aB3x9   -> redirects to the long URL

const express = require('express');
const app = express();
app.use(express.json());

// ---- storage: code -> long URL  (in prod: a DB like Postgres, keyed by code) ----
const urls = new Map();

// ---- how we make a short code ----
// 62 characters (0-9, a-z, A-Z) → short, URL-safe. 6 chars = 62^6 ≈ 56 billion combos.
const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function makeCode(len = 5) {
  let code = '';
  for (let i = 0; i < len; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
    console.log('code', code);
  }
  return code;
}

// ---- 1) SHORTEN ----
app.post('/shorten', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url is required' });

  // generate a code that isn't already taken (avoid collisions)
  let code;
  do {
    code = makeCode();
  } while (urls.has(code));

  urls.set(code, { url, clicks: 0, createdAt: Date.now() });

  res.json({ code, shortUrl: `http://localhost:4600/${code}` });
});

// ---- 2) REDIRECT ----
app.get('/:code', (req, res) => {
  const entry = urls.get(req.params.code);
  if (!entry) return res.status(404).json({ error: 'short link not found' });

  entry.clicks++; // track how many times it was clicked
  res.redirect(302, entry.url); // 302 = temporary redirect → browser goes to the long URL
});

// ---- bonus: stats for a code ----
app.get('/:code/stats', (req, res) => {
  const entry = urls.get(req.params.code);
  if (!entry) return res.status(404).json({ error: 'not found' });
  res.json({ code: req.params.code, ...entry });
});

app.listen(4600, () => console.log('🔗 URL shortener on http://localhost:4600'));
