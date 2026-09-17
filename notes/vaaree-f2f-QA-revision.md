# Vaaree F2F — Q&A Revision Sheet (last-minute)

Interviewer = senior backend (e-commerce: order sync, settlements, caching, ACL). Stack: Rails, Node,
Python, React, Postgres/MySQL, Redis, Elasticsearch/ELK, Vector DB, Sentry/New Relic, AWS, Docker.
Delivery: clarify → shape → flow → deep-dive → trade-off → tie to business (e-commerce = uptime/revenue).

═══════════════════════════════════════════════════════════════════
## REDIS / CACHING
═══════════════════════════════════════════════════════════════════

**Q: Why is Redis faster than Postgres/Mongo?**
A: (1) In-memory (RAM) vs disk — RAM ~100,000x faster. (2) O(1) key lookup, no query
parsing/joins. Trade-off: volatile + simple, so it's a cache, not the source of truth.

**Q: How does Redis retrieve data?**
A: By the KEY (not by value) — hash-table O(1) lookup. `GET key`. Key naming matters
(product:1, user:5:cart). Can't query by value like SQL.

**Q: Explain the cache-aside pattern.**
A: Check cache → HIT: return fast. MISS: query DB (slow) → store in Redis with TTL → return.
(I built this — saw 2000ms → 2ms.)

**Q: How do you keep cache fresh / handle stale data?**
A: Invalidate on update (DEL the key) + TTL as backup. Or write-through (update cache + DB together).

**Q: What if Redis is down?**
A: Graceful fallback — wrap in try/catch, go to the DB. Cache is a speed layer, NOT a dependency.
Never let a cache failure crash the app.

**Q: Why/how does Redis fail? (4 ways)**
A: (1) Out of memory (#1) → maxmemory + LRU eviction + TTL. (2) Blocking commands (single-threaded,
KEYS * freezes it) → use SCAN. (3) Disk/connection overload → monitor + pooling. (4) Single point of
failure → HA: cluster + replicas + Sentinel (auto-failover).

**Q: Where does the Redis RAM live?**
A: Local = your machine's RAM (Docker). Production = a cloud server's RAM (AWS ElastiCache), shared
by all app instances.

═══════════════════════════════════════════════════════════════════
## IDEMPOTENCY / DATA CONSISTENCY
═══════════════════════════════════════════════════════════════════

**Q: What is idempotency?**
A: Doing the same operation multiple times = same effect as once. Prevents accidental duplicates
(double-charge, duplicate order) from retries/duplicate webhooks. (Elevator button = idempotent;
ATM withdrawal = not.)

**Q: How do you implement it?**
A: Unique idempotency key (client generates a UUID, or use a natural ID like order_id). Server:
seen this key? YES → return saved result (skip). NO → process once + store the key. (I built this —
3 calls, same key twice = only 2 charges.)

**Q: Where is the key stored? Who generates it?**
A: CLIENT generates it (reuses same key on retry). SERVER stores processed keys — Redis (with TTL,
~24h) or a DB table with a unique constraint (handles concurrency).

**Q: How do you ensure data consistency in sync systems?**
A: 3 threats: (1) Duplicates → idempotency key. (2) Out-of-order updates → version/timestamp (apply
only if newer). (3) Lost updates → retries + dead-letter queue + periodic reconciliation.

═══════════════════════════════════════════════════════════════════
## ZERO-DOWNTIME / DEPLOYMENT
═══════════════════════════════════════════════════════════════════

**Q: What is zero-downtime deployment?**
A: Deploy new code without users seeing an outage. Never turn everything off at once — keep old
serving until new is healthy, then shift traffic. (e-commerce: downtime = lost orders.)

**Q: The 3 strategies?**
A: Rolling (update a few at a time — K8s default). Blue-green (switch LB to a parallel env — instant
rollback). Canary (small % first, then ramp up).

**Q: What makes it actually work? (supporting pieces)**
A: (1) Health/readiness checks — traffic only to ready instances. (2) Graceful shutdown — finish
in-flight requests before dying (`server.close()`). (3) Backward-compatible DB migrations
(expand-contract: add column → deploy → remove old later; never rename/drop in one step).

**Q: Why does no request drop? (code level)**
A: (1) Multiple instances → one restarts while another serves (no gap). (2) `server.close()` = stop
accepting NEW requests but FINISH in-flight ones, then exit → no request cut off. (I built this with
PM2 — hammered endpoint during reload, zero failures.)

**Q: How does it work with 4 pods (K8s rolling)?**
A: maxSurge/maxUnavailable control it. Add a new v2 pod → wait for health check → gracefully remove
one v1 → repeat. Count never drops below 4, LB routes only to healthy pods → zero downtime. Pods are
identical replicas, so which one is removed doesn't matter.

**Q: How do you test zero-downtime?**
A: Send continuous traffic in a loop while triggering a reload; if zero requests fail during the
reload → it works. Compare `pm2 reload` (rolling, 0 drops) vs `pm2 restart` (all at once, may drop).

**Q: Small vs big changes — which deployment approach?**
A: Small/low-risk → rolling. Big/risky → canary or blue-green. Use FEATURE FLAGS to decouple deploy
from release.

**Q: What are feature flags?**
A: A "light switch" for a feature. Deploy the code with the flag OFF (dormant), flip it ON when ready
(gradually 1%→100%), or OFF instantly if it breaks — WITHOUT redeploying. Separates deploy from release.

═══════════════════════════════════════════════════════════════════
## BACKEND SYSTEM DESIGN (their world)
═══════════════════════════════════════════════════════════════════

**Q: Design a marketplace order-sync system.**
A: Event-driven/queue-based. Marketplace --webhook/poll--> Ingest API --> Queue --> Workers -->
Postgres (source of truth) --> Redis (cache for status reads). Hard parts: idempotency (order ID =
unique key, no duplicates), retries + dead-letter queue (never lose an order), version/timestamp
(status stays consistent), API down → retry with backoff.

═══════════════════════════════════════════════════════════════════
## DATABASES
═══════════════════════════════════════════════════════════════════

**Q: What is an index / why use it?**
A: A lookup structure (B-tree) so the DB jumps to rows instead of a full scan (like a book's index).
Speeds reads on that column. Trade-off: slows writes + uses storage → only index columns you
query/filter/sort by often.

**Q: MongoDB basics?**
A: NoSQL document DB — flexible JSON-like documents in collections. Has indexes (same idea as SQL).
Key decision: EMBED (data read together, e.g. order + items — one fast query) vs REFERENCE (large/
shared data, e.g. order → vendor — store IDs, use $lookup).

**Q: SQL vs NoSQL?**
A: SQL (Postgres/MySQL): relational, joins, ACID, transactions. NoSQL (Mongo): flexible schema,
document-shaped, horizontal scale. Use SQL for relational/transactional, Mongo for flexible/document.

**Q: N+1 problem?**
A: 1 query for a list + N queries (one per item, usually in a loop). Slow (N round trips). Fix: JOIN
or batch with IN / $lookup / populate.

═══════════════════════════════════════════════════════════════════
## AI / RAG (your edge ↔ their vector DB)
═══════════════════════════════════════════════════════════════════

**Q: What is RAG?**
A: Retrieval-Augmented Generation. Retrieve relevant docs → give to the LLM → grounded, cited answer.
Stops hallucination (LLM answers from real docs, not memory). Ingest: chunk → embed (text→vector) →
store. Retrieve: embed question → cosine similarity → top-K. (I built a resilient RAG service.)

**Q: What's a vector DB / cosine similarity?**
A: Vector DB stores embeddings for fast similarity search (Pinecone/pgvector/Chroma). Cosine
similarity = cosine of the angle between two vectors; 1 = same meaning, 0 = unrelated. Retrieval finds
chunks whose vector is most similar to the question's.

═══════════════════════════════════════════════════════════════════
## AWS / DOCKER
═══════════════════════════════════════════════════════════════════

**Q: S3 → DynamoDB pattern?**
A: File → S3 → S3 event → Lambda → write metadata to DynamoDB. S3 = files, DynamoDB = fast metadata
(partition key). Make writes idempotent (S3 events can fire twice), add SQS + DLQ for reliability.

**Q: Docker basics?**
A: Runs software in isolated containers from images (blueprint). `-p host:container` maps a port,
`-d` = background. Image = blueprint, container = running instance.

**Q: Why do containers get killed?**
A: Mostly OOMKilled (exceeded memory limit) — like my ProfileX pods crashing under load; fixed with
async queue. Also: health-check fail (K8s restarts) or process crash (unhandled error).

═══════════════════════════════════════════════════════════════════
## MY PROJECTS (proof — on GitHub)
═══════════════════════════════════════════════════════════════════
github.com/lakshan-jk/backend-mastery: CRUD API · real-time (Socket.IO) · S3→DynamoDB (AWS SDK) ·
Resilient AI Service (RAG + caching + fallback) · caching demo · zero-downtime (PM2) · idempotency demo.
+ localrag (Python RAG). "Backend + AI-native engineer."

## MY STORY
"~5 yrs full-stack, backend + AI-native. At Neokred owned apps end-to-end, led/mentored. Built RAG
systems + a resilient AI service. Want ownership at an early-stage AI company like Vaaree."

## RAILS GAP
"Core is Node/Python; haven't used Rails, but concepts (MVC, REST, ORMs) transfer — I ramp fast."

## QUESTIONS TO ASK THEM
- How do you keep data consistent between internal systems and marketplaces?
- Caching strategy as you scale? · Vector DB / AI layer architecture? · Biggest backend challenge now?
