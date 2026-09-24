# Resilient AI Service (Node.js RAG)

A production-minded **Retrieval-Augmented Generation (RAG)** service — not a toy. It answers
questions grounded in your documents, with **citations**, and is built to stay up even when the
AI model is slow or failing.

Runs 100% local & free using **Ollama** (no API keys, no cloud bill).

## What it does
1. **Ingest** (once at startup): load docs → chunk → embed with `nomic-embed-text`
2. **Retrieve**: embed the question → cosine similarity → top-K relevant chunks
3. **Generate**: `llama3.2` answers using ONLY those chunks → grounded + cited

## Why "resilient" (the production touches)
- **Ingest once** at startup (kept in memory) — every request is fast
- **Caching** — repeated questions return instantly (~240x faster in tests) and survive an AI outage
- **Timeout + graceful fallback** — a hung/failing LLM never crashes the service; it returns a
  friendly `degraded` response instead
- **Rate limiting** — 20 req/min per IP → `429` on abuse
- **Health check** (`GET /health`) — reports readiness (for load balancers / zero-downtime deploys)
- **Request logging**

## API
| Method | Route | Body | Returns |
|---|---|---|---|
| GET | `/health` | — | `{status, ingested, chunks, cachedAnswers}` |
| POST | `/ask` | `{"question": "..."}` | `{answer, sources, cached}` (or `degraded:true` on fallback) |

## Run
```bash
# 1. have Ollama running with the models
ollama pull nomic-embed-text
ollama pull llama3.2

# 2. install + start
npm install
node server.js            # http://localhost:4100

# 3. try it
curl http://localhost:4100/health
curl -X POST http://localhost:4100/ask -H "Content-Type: application/json" \
  -d '{"question":"what is chunking"}'
```

## Files
- `ragLib.js` — the RAG core (ingest + ask), reusable
- `server.js` — the resilient Express API (caching, timeout, fallback, rate limit, health)
- `rag.js` — a CLI version of the RAG
- `docs/` — sample documents to answer over

## Stack
Node.js · Express · Ollama (nomic-embed-text + llama3.2) · in-memory vector store + cosine similarity

## What this demonstrates
Backend engineering + AI-native skills: building an LLM/RAG feature that is **fast, cheap, and
reliable in production** — the AI failing does not take down the app.
