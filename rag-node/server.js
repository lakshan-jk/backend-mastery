// ===== server.js — Resilient AI Service (RAG behind a production-minded API) =====
// Run:  npm install express   then   node server.js
// Endpoints:  POST /ask {question}   |   GET /health
// Reliability: ingest-once, caching, timeout + graceful fallback, rate limiting, logging.

const express = require('express');
const { ingest, ask } = require('./ragLib');

const app = express();
app.use(express.json());

// ---- shared state ----
let chunks = []; // the ingested docs (filled at startup)
let ready = false; // is ingest done?
const cache = new Map(); // question -> { answer, sources }  (repeated Q = instant)

// ---- request logging middleware ----
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// ---- simple rate limiter (max N requests per IP per window) ----
const hits = new Map();
const WINDOW_MS = 60_000,
  MAX_REQ = 20;
app.use((req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const rec = hits.get(ip) || { count: 0, start: now };
  if (now - rec.start > WINDOW_MS) {
    rec.count = 0;
    rec.start = now;
  } // reset window
  rec.count++;
  hits.set(ip, rec);
  if (rec.count > MAX_REQ) return res.status(429).json({ error: 'Too many requests, slow down.' });
  next();
});

// ---- GET /health — is the service healthy? ----
app.get('/health', (req, res) => {
  res.json({
    status: ready ? 'ok' : 'starting',
    ingested: ready,
    chunks: chunks.length,
    cachedAnswers: cache.size,
  });
});

// ---- POST /ask — the main endpoint ----
app.post('/ask', async (req, res) => {
  const { question } = req.body;

  if (!ready) return res.status(503).json({ error: 'Service still starting, try again shortly.' });
  if (!question || !question.trim()) return res.status(400).json({ error: 'question is required' });

  // CACHE: repeated question -> instant, cheap, and survives an AI outage
  if (cache.has(question)) {
    return res.json({ ...cache.get(question), cached: true });
  }

  try {
    // ask() has a built-in timeout so a hung LLM can't block forever
    const result = await ask(question, chunks, { timeoutMs: 20000 });
    cache.set(question, result); // store for next time
    res.json({ ...result, cached: false });
  } catch (err) {
    // GRACEFUL FALLBACK: AI failed/timed out -> app stays up, returns something useful
    console.error('ask failed:', err.message);
    res.status(200).json({
      answer: "Sorry, I couldn't generate an answer right now. Please try again in a moment.",
      sources: [],
      degraded: true, // signal that this is a fallback, not a real answer
    });
  }
});

// ---- startup: ingest ONCE, then start serving ----
const PORT = process.env.PORT || 4100;
app.listen(PORT, async () => {
  console.log(`🚀 Resilient AI Service on http://localhost:${PORT}`);
  console.log('📥 ingesting documents...');
  try {
    chunks = await ingest();
    ready = true;
    console.log(`✅ ready — indexed ${chunks.length} chunks`);
  } catch (err) {
    console.error('❌ ingest failed:', err.message, '(is Ollama running?)');
  }
});
