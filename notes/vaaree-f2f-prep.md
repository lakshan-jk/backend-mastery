# Vaaree F2F Prep (next Tuesday)

Interviewer = senior backend engineer (e-commerce marketplace: settlements, order sync, caching,
ACL, financial logic). Stack: Rails, Node, Python, React, Postgres/MySQL, Redis, Elasticsearch/ELK,
Vector DB, Sentry/New Relic, AWS, Docker. Values: scalable APIs, caching, observability, data
consistency, system design. → Prep THEIR areas. Be genuine, high-ownership, all-rounder.

---

## 1. BACKEND SYSTEM DESIGN — order-sync / settlement (their #1 area) ⭐
Shape: event-driven / queue-based. Flow:
Marketplace --webhook/poll--> Ingest API --> Queue --> Workers --> Postgres (source of truth) --> Redis (cache)
- Ingest: webhooks (real-time) + polling (fallback, catches misses)
- Queue: decouple + absorb spikes + retries (Kafka/BullMQ/SQS)
- Workers: validate/transform/store; scale independently
- Postgres: source of truth; Redis: fast status reads
Hard parts: **idempotency** (marketplace order ID = unique key, never duplicate),
**retries + dead-letter queue** (never lose an order), **version/timestamp** (status stays consistent),
marketplace API down -> retry with backoff.

## 2. CACHING (Redis) — they love it
- Cache-aside: check cache -> miss -> DB -> populate. TTL for freshness. Invalidate on update.
- Why: 50k orders/day + frequent status reads -> don't hit DB every time.
- Trade-off: eventual consistency (stale for TTL window).
- Redis crash: out-of-memory (maxmemory + LRU eviction + TTL), single-threaded (avoid KEYS *),
  single point of failure (HA cluster + Sentinel), app falls back to DB gracefully.

## 3. DATA CONSISTENCY / SYNC
- Idempotency key so retries/duplicate webhooks don't double-process.
- Version/timestamp so an older update never overwrites a newer one.
- Sync pipeline via events; reconcile with periodic polling.
- Handle edge cases: partial failures, out-of-order events, external API down.

## 4. ZERO-DOWNTIME / CI-CD / DOCKER (impressed them)
- Rolling deployment (some instances always serving) + health/readiness checks
  + graceful shutdown (finish in-flight) + backward-compatible DB migrations (expand-contract).
- CI/CD (Jenkins/GitHub Actions): build -> test -> docker image -> deploy -> auto-rollback on health fail.
- Docker: package app + deps, runs identically everywhere. Business: downtime = lost orders.

## 5. AI / RAG / VECTOR DB (your edge <-> their vector DB / VibeCheck)
- RAG = retrieve relevant docs -> give to LLM -> grounded, cited answer (stops hallucination).
- Ingest: chunk -> embed (text->vector) -> store. Retrieve: embed question -> cosine similarity -> top-K.
- Vector DB stores embeddings for fast similarity search at scale (Pinecone/pgvector/Chroma).
- I built a resilient RAG service (caching, timeout, fallback) — connects to your vector DB / AI layer.

## 6. OBSERVABILITY (they use Sentry/New Relic/ELK)
- 3 pillars: logs + metrics + traces. Sentry = error tracking; New Relic = APM/perf; ELK = log search.
- Tag logs with request/version IDs. Alert on SLOs. "Can't fix what you can't see."

## 7. DATABASES
- SQL (Postgres/MySQL): relational, joins, ACID, transactions. NoSQL (Mongo): flexible, scale.
- Indexes speed reads (EXPLAIN); N+1 = query in a loop -> fix with JOIN / IN. Read replicas for read-heavy.
- Connection pooling. Backward-compatible migrations for zero-downtime.

## 8. CODING (DSA) — light
Patterns: hashmap/frequency, two pointers, sliding window, Kadane, stack. Narrate + O(n)/O(1) + edge cases.

## 9. JS FUNDAMENTALS
Closures, this (arrow = lexical), == vs ===, event loop (sync->micro->macro), promises (all/race/allSettled/any).

## 10. REACT / MERN (conversant)
Hooks (useState/useEffect + rules), virtual DOM, controlled components, state mgmt, Express middleware, Mongo schema.

## 11. WHY VAAREE + OWNERSHIP + RAILS GAP
- Why: early-stage ownership, full-stack + AI blend, VibeCheck AI excites me.
- All-rounder: own features end-to-end, jump anywhere, ship fast, mentored at Neokred.
- Rails gap: "core is Node/Python; haven't used Rails but concepts transfer, I ramp fast."

## 12. SMART QUESTIONS TO ASK THEM
- How do you keep data consistent between internal systems and external marketplaces?
- What's your caching strategy as you scale?
- How's the vector DB / AI layer architected?
- Biggest backend challenge on the team right now?

## DELIVERY (every answer)
Clarify/assume -> name the shape -> the flow -> deep-dive one part -> trade-off -> tie to business (e-commerce = uptime/revenue).
Narrate out loud. If unknown: "that thrills me + here's how I'd approach it." Be genuine + curious.
