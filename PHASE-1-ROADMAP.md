# Phase 1 — Practical Backend + AWS (100% FREE, hands-on)

Goal: rebuild coding muscle + build a REAL backend with every core piece (API, DB, cache,
queue, real-time, AWS) — all running locally at ₹0. End with real projects + real confidence.

Duration: ~2 weeks (flexible). Rule: BUILD everything, AI off for coding practice.

## 🆓 The free toolkit (nothing costs money)

- **Node.js** — free (you have it)
- **Docker Desktop** — free → run Redis, Postgres, Mongo locally (no cloud)
- **LocalStack** — free → emulates AWS (S3, Lambda, DynamoDB, SQS) LOCALLY, no AWS bill
- **AWS Free Tier** — 12 months free for many services (optional, use with a billing alarm)
- **VS Code** — free
- Learning: official docs, freeCodeCamp/YouTube — free

> KEY: **LocalStack** lets you practice real AWS (S3/Lambda/DynamoDB/SQS) on your laptop for FREE,
> with zero risk of a cloud bill. That solves "practical AWS at no cost."

---

## Module 0 — Rebuild coding muscle (daily, ALL phase)

- 2-3 problems/day from `~/interview-prep/practice/`, HAND-CODED, AI OFF
- 20-30 min. Fixes the vibe-coding rust. Non-negotiable.

## Module 1 — Build a real REST API (Node + Express) [free]

- CRUD API (e.g., a "products" or "tasks" service): GET/POST/PUT/DELETE
- Learn: routes, middleware, request/response, error handling, validation, status codes
- Deliverable: working API you test with curl/Postman (Postman free)

## Module 2 — Add a database (Postgres OR Mongo via Docker) [free]

- `docker run` Postgres or Mongo locally — no install, no cloud
- Learn: schema/data modeling, queries, indexes, connection pooling
- Wire the API to the DB (real persistence)

## Module 3 — Add caching (Redis via Docker) [free]

- `docker run redis` locally
- Learn: cache-aside pattern, TTL, invalidation
- Cache your API's read endpoints → see the speed difference

## Module 4 — Add a queue + worker (BullMQ + Redis) [free]

- Offload a "heavy" task to a background worker
- Learn: producer/consumer, retries, dead-letter, async processing

## Module 5 — Real-time (Socket.IO) [free] ← already started!

- Finish the realtime/ app: broadcast → rooms → presence
- Learn: WebSocket, broadcast, rooms, the cross-server (Redis adapter) concept

## Module 6 — AWS hands-on via LocalStack (S3 + Lambda + DynamoDB + SQS) [FREE]

- Run LocalStack in Docker → real AWS APIs, locally, no bill
- Build the classic pattern: upload file to S3 → trigger → write to DynamoDB
- Learn: S3, DynamoDB (partition key), Lambda, SQS, event-driven, idempotency
- (Optional) repeat once on AWS Free Tier with a billing alarm set

## Module 7 — Dockerize + compose it all [free]

- Write a Dockerfile for the API; docker-compose to run API + Postgres + Redis together
- Learn: containers, images, docker-compose, env vars, health checks

---

## End of Phase 1 — what you'll have

- ✅ Coding muscle rebuilt (hand-coding daily)
- ✅ A real backend: API + DB + cache + queue + real-time + AWS (LocalStack) + Docker
- ✅ 1-2 GitHub projects = portfolio + real interview stories
- ✅ Genuine hands-on knowledge (not theory) for backend + AWS interviews

## The weekly rhythm

```
Daily:   hand-code 2-3 problems (AI off) + explain 1 backend topic out loud
Weekly:  build 1-2 modules above in this repo, commit + push
Ongoing: apply + chase referrals (referrals skip AI rounds -> F2F = your strength)
```

## Phase 2 (later) — depth

System design deep-dives, more AWS (ECS/EKS, CI/CD, IaC), advanced DSA, scaling projects.

## The rule

Everything runs LOCALLY and FREE. Build it, run it, break it, fix it. That's real knowledge.
