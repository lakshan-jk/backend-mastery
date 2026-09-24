// ===== Zero-Downtime Deployment — all 3 strategies, live =====
// A tiny load balancer in front of a fleet of app "instances". You can trigger
// ROLLING, BLUE-GREEN, and CANARY deploys and watch traffic shift from v1 -> v2
// with ZERO dropped requests. Everything runs in one process for clarity.
//
// Run:      node strategies-demo.js        -> http://localhost:5000
// Load:     while true; do curl -s localhost:5000/ ; echo; sleep 0.2; done
// (or use the built-in /loadtest that fires 100 requests and reports the split)
//
// Endpoints:
//   GET  /                      -> LB routes to an instance; returns which version served
//   GET  /status                -> fleet state + current strategy
//   POST /deploy/rolling        -> replace v1 instances with v2 one at a time
//   POST /deploy/blue-green     -> bring up a parallel v2 env, then flip the LB
//   POST /deploy/canary?pct=20  -> send pct% of traffic to v2, rest to v1
//   POST /deploy/promote        -> finish a canary (send 100% to v2)
//   GET  /loadtest              -> fire 100 internal requests, report v1/v2 split + errors

const express = require("express");
const app = express();

// ---- the FLEET: each instance has a version, health, and "color" (blue/green) ----
let fleet = [
  { id: "i1", version: "v1", healthy: true,  color: "blue" },
  { id: "i2", version: "v1", healthy: true,  color: "blue" },
  { id: "i3", version: "v1", healthy: true,  color: "blue" },
  { id: "i4", version: "v1", healthy: true,  color: "blue" },
];

let strategy = "none";        // "none" | "rolling" | "blue-green" | "canary"
let liveColor = "blue";       // for blue-green: which env the LB points at
let canaryPct = 0;            // for canary: % of traffic to v2
let rr = 0;                   // round-robin counter

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- health check: only route to instances that pass ----
function healthyInstances(color = null) {
  return fleet.filter((i) => i.healthy && (color ? i.color === color : true));
}

// ---- THE LOAD BALANCER: pick an instance based on the active strategy ----
function pickInstance() {
  if (strategy === "canary") {
    // send canaryPct% to a v2 instance, the rest to v1
    const roll = (rr++ % 100);
    const wantV2 = roll < canaryPct;
    const pool = healthyInstances().filter((i) => (wantV2 ? i.version === "v2" : i.version === "v1"));
    const use = pool.length ? pool : healthyInstances(); // fallback if that version isn't up yet
    return use[rr % use.length];
  }
  if (strategy === "blue-green") {
    // only route to the currently-live color
    const pool = healthyInstances(liveColor);
    return pool[rr++ % pool.length];
  }
  // default / rolling: round-robin over all healthy instances
  const pool = healthyInstances();
  return pool[rr++ % pool.length];
}

// ---- the user-facing endpoint (this is what must NEVER drop) ----
app.get("/", (req, res) => {
  const inst = pickInstance();
  if (!inst) return res.status(503).json({ error: "no healthy instances" }); // should never happen
  res.json({ servedBy: inst.id, version: inst.version, color: inst.color });
});

app.get("/status", (req, res) => {
  res.json({ strategy, liveColor, canaryPct, fleet });
});

// ---- STRATEGY 1: ROLLING — replace v1 -> v2 one instance at a time ----
app.post("/deploy/rolling", async (req, res) => {
  strategy = "rolling";
  const log = [];
  for (const inst of fleet.filter((i) => i.version === "v1")) {
    // 1) drain: mark unhealthy so LB stops routing to it (graceful — others still serve)
    inst.healthy = false;
    log.push(`drain ${inst.id}`);
    await sleep(200);                         // simulate finishing in-flight requests
    // 2) upgrade + health check before returning to the pool
    inst.version = "v2";
    await sleep(200);                         // simulate boot
    inst.healthy = true;                      // /health passes -> back in rotation
    log.push(`${inst.id} -> v2 healthy`);
  }
  res.json({ done: "rolling complete — all v2", steps: log, note: "count never dropped below 3 healthy" });
});

// ---- STRATEGY 2: BLUE-GREEN — stand up a parallel green(v2) env, then flip ----
app.post("/deploy/blue-green", async (req, res) => {
  strategy = "blue-green";
  // 1) bring up GREEN = a full parallel set of v2 instances (blue keeps serving)
  const green = [1, 2, 3, 4].map((n) => ({ id: `g${n}`, version: "v2", healthy: false, color: "green" }));
  fleet.push(...green);
  await sleep(400);                           // simulate green booting + smoke tests
  green.forEach((g) => (g.healthy = true));    // green passes health checks
  // 2) FLIP the load balancer to green — instant cutover
  liveColor = "green";
  res.json({
    done: "flipped to GREEN (v2)",
    rollback: "instant — set liveColor back to blue",
    note: "blue still exists for rollback; tear down later",
  });
});

// ---- STRATEGY 3: CANARY — send a small % to v2, watch, then ramp ----
app.post("/deploy/canary", async (req, res) => {
  strategy = "canary";
  const pct = Number(req.query.pct || 10);
  // ensure at least one v2 instance exists to receive canary traffic
  if (!fleet.some((i) => i.version === "v2")) {
    const target = fleet.find((i) => i.version === "v1");
    target.healthy = false; await sleep(200);
    target.version = "v2";  await sleep(200);
    target.healthy = true;
  }
  canaryPct = pct;
  res.json({ done: `canary at ${pct}% -> v2`, next: "watch metrics, then POST /deploy/promote or lower pct" });
});

// promote a canary to 100% (all v2)
app.post("/deploy/promote", async (req, res) => {
  for (const inst of fleet.filter((i) => i.version === "v1")) {
    inst.healthy = false; await sleep(150);
    inst.version = "v2";  await sleep(150);
    inst.healthy = true;
  }
  canaryPct = 100;
  res.json({ done: "canary promoted — 100% v2" });
});

// ---- built-in load test: fire N internal requests, report the v1/v2 split ----
app.get("/loadtest", (req, res) => {
  const n = Number(req.query.n || 100);
  const split = { v1: 0, v2: 0, errors: 0 };
  for (let k = 0; k < n; k++) {
    const inst = pickInstance();
    if (!inst) split.errors++;
    else split[inst.version]++;
  }
  res.json({ requests: n, ...split, dropped: split.errors });
});

app.listen(5055, () => console.log("🚦 zero-downtime strategies demo on http://localhost:5055"));
