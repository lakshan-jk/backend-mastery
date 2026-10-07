<div align="center">

# ⚙️ Backend Mastery

**Production-minded backend engineering patterns — each a small, _runnable_ implementation you can start and hit with `curl`, with design notes on the trade-offs.**

![Node](https://img.shields.io/badge/Node-22-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?logo=amazonaws&logoColor=white)
![CI](https://github.com/lakshan-jk/backend-mastery/actions/workflows/ci.yml/badge.svg)

*Caching · Idempotency · Rate limiting · Resilient deploys · Access control · Real-time · AI/RAG · SQL & DSA*

</div>

---

## 🤔 Why does this exist?

Because *"yeah, I know how caching works"* and *"I built cache-aside with a graceful Redis fallback and watched it survive a Redis outage"* are two **very** different sentences. 😅

Knowing a concept and having it in your fingers are not the same thing — so this is my **hands-on playground**: the backend patterns every engineer should have muscle memory for, built small and runnable so I keep them sharp (and pick up new ones along the way). Theory fades; `curl`-ing your own idempotency guard at 2am sticks.

### 👀 Who's this for?

- **Brushing up before an interview?** Each folder is a self-contained demo — skim the code, run it, re-derive the trade-offs. Great for *"wait, how does a token bucket actually work again?"* moments.
- **Learning a topic fresh?** Start it, break it, fix it. Every demo prints its own `curl` commands — poke at it until it clicks.
- **Just curious?** Same deal. No slideware, no *"trust me, it works."* Real, runnable code that you can watch (not) fall over. 🔥

Pick a folder, run it, learn by doing. That's the whole idea.

---

## 📦 What's inside

Each pattern is a **self-contained, runnable** demo — not pseudocode. Start it, hit the endpoints, read the trade-offs.

| Area | Demo | Key idea |
|------|------|----------|
| **Caching** | [`caching/`](caching) | Cache-aside with Redis, TTL, graceful fallback |
| **Idempotency** | [`idempotency/`](idempotency) | Atomic claim (`SET NX`) — no double-processing under concurrency |
| **Rate limiting** | [`rate-limiter/`](rate-limiter) | Fixed-window counter, per-user, as middleware + API |
| **Feature flags** | [`feature-flags/`](feature-flags) | Canary rollout by consistent hashing, flipped live |
| **URL shortener** | [`url-shortener/`](url-shortener) | In-memory, Redis-cached & MongoDB variants; counter + base62 |
| **Access control** | [`security/`](security) | RBAC + ownership check (blocks IDOR) |
| **Zero-downtime deploys** | [`zero-downtime/`](zero-downtime) | Rolling / blue-green / canary — 0 dropped requests |
| **AI / RAG** | [`rag-node/`](rag-node) | Retrieval → grounding → generation, with timeout + fallback |
| **Real-time** | [`realtime/`](realtime) | WebSocket (Socket.IO) + Redis pub/sub |
| **Cloud** | [`aws/`](aws) | Event-driven S3 → DynamoDB pattern |
| **Interview practice** | [`interview-practice/`](interview-practice) | JS/DSA patterns + a runnable **SQL course**, with PASS/FAIL checkers |

> 📐 **Design write-ups & diagrams** live in [`notes/`](notes): backend roadmap, flow & sequence diagrams, order-sync architecture, Kubernetes + system design, and a video-generation agent HLD/LLD.

---

## 🚀 Quick start

Every folder is independent — pick one and run it:

```bash
cd caching
npm install
node cache-demo.js        # most demos print the port + example curl commands at the top
```

For the interview practice:
```bash
cd interview-practice
node coding-practice-all.js                 # JS/DSA — turn FAIL → PASS
sqlite3 practice.db < sql-seed.sql          # build the SQL practice DB
sqlite3 practice.db < sql-learn.sql         # run the SQL course
```

---

## 🔁 CI/CD

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs the test suites on every push/PR (Node 22) and gates a deploy step behind passing tests — a minimal, honest CI/CD pipeline.

---

## 🗂️ Repository layout

```
caching/          idempotency/      rate-limiter/      feature-flags/
url-shortener/    security/         zero-downtime/     rag-node/
realtime/         aws/              interview-practice/   notes/
.github/workflows/
```

Each demo folder has its own `package.json`. Design notes and diagrams live in `notes/`.

---

<div align="center">
<sub>Built by <b>Lakshan Kumar J</b> · <a href="https://github.com/lakshan-jk">GitHub</a> · <a href="https://lakshan-jk-portfolio.vercel.app">Portfolio</a></sub>
</div>
