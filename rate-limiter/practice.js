// // ===== Rate Limiter — with time window (complete) =====
// // Allow max 5 requests per user per 10 seconds. 6th in the window -> blocked.
// // Run:  node practice.js

// const hits = new Map(); // user -> { count, resetAt }
// const LIMIT = 5;
// const WINDOW_MS = 10000; // 10 seconds

// function isAllowed(user) {
//   const now = Date.now();
//   let rec = hits.get(user);

//   // new user, OR their window expired -> start a fresh window
//   if (!rec || now > rec.resetAt) {
//     rec = { count: 0, resetAt: now + WINDOW_MS };
//     hits.set(user, rec);
//   }

//   rec.count++; // count this request
//   return rec.count <= LIMIT; // allowed if within the limit
// }

// // --- test: call it 7 times for "bob" ---
// for (let i = 1; i <= 7; i++) {
//   console.log(`request ${i}:`, isAllowed('bob') ? '✅ allowed' : '❌ blocked');
// }

// const express = require('express');
// const app = express();

// app.get('/', (req, res) => {
//   const user = req.headers['x-user'] || req.ip;
//   if (!isAllowed(user)) {
//     return res.status(429).json({ error: 'Too many requests' });
//   }

//   res.json({ ok: true, message: 'request allowed' });
// });

// const hits = new Map(); // user -> { count, resetAt }
// const LIMIT = 5;
// const WINDOW_MS = 10000; // 10 seconds

// function isAllowed(user) {
//   const now = Date.now();
//   let rec = hits.get(user);

//   // new user, OR their window expired -> start a fresh window
//   if (!rec || now > rec.resetAt) {
//     rec = { count: 0, resetAt: now + WINDOW_MS };
//     hits.set(user, rec);
//   }

//   rec.count++; // count this request
//   return rec.count <= LIMIT; // allowed if within the limit
// }

const hits = new Map(); // user -> { count, resetAt }
const limit = 5;
const windowMs = 10000; // 10 seconds

function isAllowed(user) {
  const now = Date.now();
  let rec = hits.get(user);

  if (!rec || now > rec.resetAt) {
    rec = { count: 0, resetAt: now + windowMs };
    hits.set(user, rec);
  }
  rec.count++;
  return rec.count <= limit;
}
