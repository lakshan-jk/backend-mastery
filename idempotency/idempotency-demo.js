// ===== Hands-on: Idempotency =====
// Same request sent twice -> charged ONCE (safe to repeat).
// Run:  npm install express && node idempotency-demo.js  ->  http://localhost:4400
//
// Each request carries an "Idempotency-Key" header (the unique ticket 🎟️).
// If we've seen that key -> return the saved result (don't charge again).

const express = require("express");
const app = express();
app.use(express.json());

// "memory" of processed keys -> their result (in prod: Redis or a DB table)
const processed = new Map();

// a fake "charge the card" — the dangerous-to-repeat action
let totalCharged = 0;
function chargeCard(amount) {
  totalCharged += amount;                 // this is what we must NOT do twice
  return { chargeId: "chg_" + Date.now(), amount, totalChargedSoFar: totalCharged };
}

app.post("/pay", (req, res) => {
  const key = req.headers["idempotency-key"];   // the unique ticket
  const { amount } = req.body;

  if (!key) return res.status(400).json({ error: "Idempotency-Key header required" });

  // 1) Seen this key before? -> return the SAVED result, don't charge again
  if (processed.has(key)) {
    return res.json({ ...processed.get(key), replayed: true });
  }

  // 2) New key -> do the charge ONCE, then remember it
  const result = chargeCard(amount);
  processed.set(key, result);
  res.json({ ...result, replayed: false });
});

// see the total (proof it only charged once)
app.get("/total", (req, res) => res.json({ totalCharged }));

app.listen(4400, () => console.log("🚀 idempotency demo on http://localhost:4400"));
