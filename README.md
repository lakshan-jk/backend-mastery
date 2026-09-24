# Backend Mastery — Runnable Demos & Design Notes

A hands-on collection of backend engineering patterns — each one a small, **runnable** implementation you can start and hit with `curl`, plus design notes explaining the trade-offs. Built to demonstrate practical, production-minded backend work: caching, idempotency, resilient deploys, access control, real-time, and AI-native services.

**Stack:** Node.js · Express · Redis · MongoDB · AWS · Docker · GitHub Actions

---

## What's inside

| Area | Demo | Key idea |
|------|------|----------|
| **Caching** | [`caching/`](caching) | Cache-aside with Redis, TTL, graceful fallback |
| **Idempotency** | [`idempotency/`](idempotency) | Atomic claim (`SET NX`) — no double-processing under concurrency |
| **Rate limiting** | [`rate-limiter/`](rate-limiter) | Fixed-window counter, per-user, as middleware + API |
| **Feature flags** | [`feature-flags/`](feature-flags) | Canary rollout by consistent hashing, flipped live |
| **URL shortener** | [`url-shortener/`](url-shortener) | In-memory, Redis-cached, and MongoDB variants; counter + base62 |
| **Access control** | [`security/`](security) | RBAC + ownership check (blocks IDOR) |
| **Zero-downtime** | [`zero-downtime/`](zero-downtime) | Rolling / blue-green / canary strategies, 0 dropped requests |
| **AI / RAG** | [`rag-node/`](rag-node) | Retrieval → grounding → generation, with timeout + fallback |
| **Real-time** | [`realtime/`](realtime) | WebSocket (Socket.IO) + Redis pub/sub |
| **Cloud** | [`aws/`](aws) | Event-driven S3 → DynamoDB pattern |
| **DSA practice** | [`interview-practice/`](interview-practice) | Array / hashmap / sort / string patterns with tests |

Design write-ups (with diagrams) live in [`notes/`](notes) — backend roadmap, flow & sequence diagrams, order-sync architecture, URL shortener, Kubernetes + system design, and a video-generation agent HLD/LLD.

---

## Running a demo

Each folder is self-contained:

```bash
cd caching
npm install
node cache-demo.js        # then hit the endpoints with curl
```

Most demos print the port and example `curl` commands at the top of the file.

---

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs the DSA test suites on every push/PR (Node 22), and gates a placeholder deploy job behind passing tests — a minimal CI/CD pipeline.

---

## Repository layout

```
caching/          idempotency/      rate-limiter/     feature-flags/
url-shortener/    security/         zero-downtime/    rag-node/
realtime/         aws/              interview-practice/
notes/            .github/workflows/
```

Each demo folder is independent, with its own `package.json`. Design notes and diagrams are in `notes/`.
