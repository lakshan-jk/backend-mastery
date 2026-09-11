# Backend Mastery Roadmap (real-time focus)

Goal: go from "I've read about it" to "I BUILT it" — so real-time stops being scary.
Workflow: learn the concept (chat) → build it yourself (this repo) → explain it out loud.

## The gap we're closing

Real-time / WebSocket confidence — by building a working chat app end-to-end.

---

## Module 1 — WebSocket basics + a tiny echo server ⏳ START HERE

- What WebSocket is (persistent, full-duplex), HTTP vs WS, the handshake
- BUILD: a Socket.IO server that echoes messages back
- Explain: connection lifecycle (connect / message / disconnect)

## Module 2 — Real-time chat (1 room)

- BUILD: multiple clients, broadcast a message to everyone
- Concepts: broadcast, events, rooms

## Module 3 — Rooms + presence

- BUILD: join/leave rooms, show who's online
- Concepts: rooms, presence with a map, heartbeat idea

## Module 4 — Scaling across servers (the interview centerpiece)

- Concept + demo idea: Redis Pub/Sub backplane so 2 servers can talk
- Concepts: why rooms are per-server, the adapter, A→S1→Redis→S2→B

## Module 5 — Reliability

- Reconnection, message IDs + idempotency (no duplicates), ordering, offline delivery
- Concept + small code touches

## Module 6 — Explain it like an interview

- Narrate the whole design out loud; answer the standard follow-ups

---

## After real-time (broader backend, same build-first approach)

- Caching (build a cache-aside example with an in-memory/Redis map)
- Queue (build a tiny job queue + worker)
- Rate limiter (build a simple token-bucket middleware)
- Idempotency (build an idempotency-key middleware)

## The rule

Every module: **learn → build in `realtime/` (or a practice file) → run it → explain out loud.**
Building it yourself = real experience = confidence.
