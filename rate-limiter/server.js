// ===== Rate Limiter (fixed-window counter) =====
// Limit each user to N requests per time window. The (N+1)th gets 429.
//
// Run:  npm install express && node server.js   -> http://localhost:4700
// Test: for i in $(seq 1 7); do curl -s -o /dev/null -w "%{http_code} " localhost:4700/ -H "x-user: bob"; done
//       -> 200 200 200 200 200 429 429   (5 allowed, then blocked)

const express = require('express');
const app = express();

const LIMIT = 5; // max requests...
const WINDOW_MS = 10_000; // ...per 10 seconds

// remember each user's count + when their window resets
// key = user, value = { count, resetAt }
const hits = new Map();

function rateLimiter(req, res, next) {
  const user = req.headers['x-user'] || req.ip; // who is this?
  const now = Date.now();

  let record = hits.get(user);

  // no record yet, OR their window has expired -> start a fresh window
  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + WINDOW_MS };
    hits.set(user, record);
  }

  record.count++; // count this request

  // over the limit? -> block
  if (record.count > LIMIT) {
    const retryIn = Math.ceil((record.resetAt - now) / 1000);
    res.set('Retry-After', retryIn);
    return res.status(429).json({ error: 'Too many requests', retryInSeconds: retryIn });
  }

  // under the limit -> allow, and tell them how many they have left
  res.set('X-RateLimit-Limit', LIMIT);
  res.set('X-RateLimit-Remaining', LIMIT - record.count);
  next();
}

app.use(rateLimiter); // apply to every route

app.get('/', (req, res) => res.json({ ok: true, message: 'request allowed' }));

app.listen(4700, () => console.log('🚦 rate limiter on http://localhost:4700'));
