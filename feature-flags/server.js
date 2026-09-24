// ===== Feature Flags + Canary Rollout =====
// Decides which users see the NEW version — without redeploying.
// Flip the flag / change the % live via the /admin endpoint.
//
// Run:  npm install express && node server.js   -> http://localhost:4800
// Test as different users:
//   curl localhost:4800/checkout -H "x-user-id: 10"
//   curl localhost:4800/checkout -H "x-user-id: 27"
//   curl -X POST "localhost:4800/admin/flag?feature=new-checkout&percent=50"   (change rollout %)

const express = require("express");
const app = express();

// ---- the flags "config" (in prod this lives in LaunchDarkly / a DB / Redis) ----
const flags = {
  "new-checkout": { enabled: true, percent: 5, allowUsers: [1], allowRegions: ["bangalore"] },
};

// ---- the rule: should THIS user get the feature? ----
function isEnabled(feature, user) {
  const f = flags[feature];
  if (!f || !f.enabled) return false;                     // flag off for everyone

  if (f.allowUsers.includes(user.id)) return true;        // explicit allow-list (internal/beta)
  if (f.allowRegions.includes(user.region)) return true;  // whole region rollout

  // consistent % rollout: same user ALWAYS lands in the same bucket (not random per request)
  return (user.id % 100) < f.percent;                      // e.g. percent=5 -> ids ending 0-4
}

// fake "who is this user" (prod: from JWT / session)
function getUser(req) {
  return { id: Number(req.headers["x-user-id"] || 0), region: req.headers["x-region"] || "other" };
}

// ---- the endpoint uses the flag to pick old vs new ----
app.get("/checkout", (req, res) => {
  const user = getUser(req);
  if (isEnabled("new-checkout", user)) {
    return res.json({ user: user.id, version: "NEW checkout ✨ (canary)" });
  }
  res.json({ user: user.id, version: "old checkout" });
});

// ---- admin: change the flag LIVE (no redeploy) ----
app.post("/admin/flag", (req, res) => {
  const { feature, percent, enabled } = req.query;
  const f = flags[feature];
  if (!f) return res.status(404).json({ error: "no such flag" });
  if (percent !== undefined) f.percent = Number(percent);
  if (enabled !== undefined) f.enabled = enabled === "true";
  res.json({ feature, ...f, note: "changed live — no redeploy" });
});

app.get("/admin/flags", (req, res) => res.json(flags));

app.listen(4800, () => console.log("🎛️  feature flags on http://localhost:4800"));
