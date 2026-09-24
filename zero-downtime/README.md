# Zero-Downtime Deployment — Demos

Two runnable demos proving you can ship new code **without dropping a single request**.

---

## 1. `server.js` — graceful shutdown (PM2)

A single app with a `/health` endpoint and graceful shutdown via `server.close()`
(stop accepting new requests, finish in-flight ones, then exit).

```bash
npm install
pm2 start server.js -i 4        # cluster mode, 4 workers
# hammer it while reloading:
while true; do curl -s localhost:4300/ >/dev/null; done &
pm2 reload server.js            # rolling reload → 0 dropped requests
pm2 restart server.js           # (compare) all-at-once → may drop requests
```

**Point:** `pm2 reload` replaces workers one at a time (rolling); `pm2 restart` kills them
all at once. Graceful shutdown is why in-flight requests aren't cut off.

---

## 2. `strategies-demo.js` — all 3 strategies, live

A tiny **load balancer** in front of a fleet of 4 app "instances". Trigger each
zero-downtime strategy and watch traffic shift from **v1 → v2** with zero drops.

```bash
npm install
node strategies-demo.js         # http://localhost:5055
```

> ⚠️ Port **5000 is taken by macOS AirPlay** (returns 403) — this demo uses **5055**.

### Endpoints
| Method | Path | What it does |
|---|---|---|
| GET  | `/` | LB routes to an instance; returns `{servedBy, version, color}` |
| GET  | `/status` | fleet state + current strategy |
| GET  | `/loadtest?n=100` | fire N internal requests, report v1/v2 split + dropped |
| POST | `/deploy/rolling` | replace v1 → v2 **one instance at a time** (drain → upgrade → health check) |
| POST | `/deploy/blue-green` | stand up a parallel **green (v2)** env, then **flip** the LB |
| POST | `/deploy/canary?pct=20` | send **pct%** of traffic to v2, rest to v1 |
| POST | `/deploy/promote` | finish a canary → 100% v2 |

### Prove zero-downtime (rolling, under live traffic)
```bash
# fire continuous traffic in one terminal:
for i in $(seq 1 120); do curl -s -o /dev/null -w "%{http_code} " localhost:5055/; sleep 0.03; done &
# deploy in another:
curl -s -X POST localhost:5055/deploy/rolling
# → every code is 200. Zero drops.
```

### Watch a canary ramp
```bash
curl -s -X POST "localhost:5055/deploy/canary?pct=20" ; curl -s localhost:5055/loadtest
# {"v1":80,"v2":20,...}  → ramp to 50 → promote to 100
```

---

## The 3 strategies (cheat sheet)

| Strategy | How | Rollback | Use when |
|---|---|---|---|
| **Rolling** | replace a few instances at a time | gradual | everyday low-risk (K8s default) |
| **Blue-green** | two full envs, flip the LB | ⚡ instant | big release, want instant rollback |
| **Canary** | small % first, then ramp | stop early | risky/user-facing change |

**Always required (any strategy):** health checks · graceful shutdown (`server.close()`)
· backward-compatible migrations (expand-contract) · external session state (Redis, not in-memory).

**Cons → all trace to "old + new coexist"** → fix with compatibility: backward-compatible
changes, feature flags, versioning, external state.

### Cleanup
```bash
pkill -f strategies-demo        # stop any lingering demo servers
```
