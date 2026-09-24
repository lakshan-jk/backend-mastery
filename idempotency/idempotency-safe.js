// ===== Idempotency (production-grade, concurrency-safe) =====
// Fixes the flaw in idempotency-demo.js: 5 requests arriving at the SAME
// millisecond could all pass a naive `if (map.has(key))` check before any
// of them writes -> double-charge. Here we make the "claim the key" step
// ATOMIC, so only ONE request wins and the rest return the saved result.
//
// Run:  node idempotency-safe.js   ->  http://localhost:4401
// (Uses an in-memory store to keep it runnable without Redis; the comments
//  show the exact Redis equivalent you'd use in production.)

const express = require("express");
const app = express();
app.use(express.json());

// ---- the store of processed keys -> saved result ----
// In production this is Redis (SET key value NX EX 86400) or a DB table
// with a UNIQUE constraint on the key. Both give us atomicity for free.
const store = new Map();          // key -> { status: "processing" | "done", result }

// atomic "claim": set the key ONLY if it doesn't exist yet.
// Returns true if THIS request won the claim, false if someone already has it.
// Redis equivalent:  redis.set(key, "processing", "NX", "EX", 86400)  -> "OK" or null
function claim(key) {
  if (store.has(key)) return false;   // already claimed
  store.set(key, { status: "processing", result: null });
  return true;                        // we won
}

// the dangerous-to-repeat action
let totalCharged = 0;
function chargeCard(amount) {
  totalCharged += amount;
  return { chargeId: "chg_" + totalCharged, amount, totalChargedSoFar: totalCharged };
}

app.post("/pay", async (req, res) => {
  // For payments we use the natural key: order_id (one order = one payment).
  const key = req.body.order_id;
  const { amount } = req.body;
  if (!key) return res.status(400).json({ error: "order_id required" });

  // 1) Try to CLAIM the key atomically.
  const won = claim(key);

  if (!won) {
    // Someone already claimed it. Two sub-cases:
    const existing = store.get(key);
    if (existing.status === "done") {
      // already finished -> return the SAME saved result (idempotent replay)
      return res.json({ ...existing.result, replayed: true });
    }
    // still processing (a concurrent duplicate arrived mid-flight)
    return res.status(409).json({ error: "duplicate in progress, retry shortly" });
  }

  // 2) We won the claim -> do the charge exactly ONCE, then save the result.
  const result = chargeCard(amount);
  store.set(key, { status: "done", result });
  res.json({ ...result, replayed: false });
});

app.get("/total", (req, res) => res.json({ totalCharged }));

app.listen(4401, () => console.log("🚀 safe idempotency on http://localhost:4401"));
