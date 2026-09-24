// ===== Rate Limiter with an API (Express) =====
// Same simple logic, now protecting a real endpoint.
// Run:  npm install express && node api.js   -> http://localhost:4702
// Test: for i in $(seq 1 7); do curl -s -o /dev/null -w "%{http_code} " localhost:4702/ -H "x-user: bob"; done

const express = require("express");
const app = express();

const hits = new Map();   // user -> count
const LIMIT = 5;

function isAllowed(user) {
  const count = (hits.get(user) || 0) + 1;
  hits.set(user, count);
  return count <= LIMIT;
}

// middleware: runs BEFORE every request
function rateLimiter(req, res, next) {
  const user = req.headers["x-user"] || req.ip;   // who is asking
  if (!isAllowed(user)) {
    return res.status(429).json({ error: "Too many requests" });   // blocked
  }
  next();   // allowed -> continue to the route
}

app.use(rateLimiter);   // apply to all routes

app.get("/", (req, res) => res.json({ ok: true }));

app.listen(4702, () => console.log("🚦 rate-limited API on http://localhost:4702"));
