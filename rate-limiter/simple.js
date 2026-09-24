// ===== Simplest Rate Limiter (count only) =====
// Allow max 5 requests per user. 6th -> blocked.
// Run:  node simple.js

const hits = new Map();
const time = 10000;

function isAllowed(user) {
  hits[user] = (hits[user] || 0) + 1;
  return hits[user] <= time;
}
// test: 7 requests for bob
for (let i = 1; i <= 7; i++) {
  console.log(`request ${i}:`, isAllowed('bob') ? '✅ allowed' : '❌ blocked');
}
