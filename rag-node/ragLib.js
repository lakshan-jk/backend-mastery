// ===== ragLib.js — the RAG core as reusable functions =====
// ingest(): load + chunk + embed docs (run once at startup)
// ask(question, chunks): retrieve relevant chunks + generate a grounded answer

const fs = require('fs');
const path = require('path');
const ollama = require('ollama').default;

const DOCS_DIR = path.join(__dirname, 'docs');
const EMBED_MODEL = 'nomic-embed-text';
const CHAT_MODEL = 'llama3.2';
const TOP_K = 3;

function loadDocs() {
  const files = fs.readdirSync(DOCS_DIR).filter((f) => /\.(md|txt)$/.test(f));
  return files.map((f) => ({ source: f, text: fs.readFileSync(path.join(DOCS_DIR, f), 'utf8') }));
}

function chunkText(text) {
  return text
    .split(/\n\s*\n/)
    .map((c) => c.trim())
    .filter((c) => c.length > 30);
}

async function embed(text) {
  const res = await ollama.embeddings({ model: EMBED_MODEL, prompt: text });
  return res.embedding;
}

function cosineSimilarity(a, b) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// INGEST — do this ONCE at startup, keep chunks in memory
async function ingest() {
  const docs = loadDocs();
  const chunks = [];
  for (const doc of docs) {
    for (const piece of chunkText(doc.text)) {
      chunks.push({ source: doc.source, text: piece, vector: await embed(piece) });
    }
  }
  return chunks;
}

// RETRIEVE + GENERATE — answer one question using the pre-ingested chunks
async function ask(question, chunks, { timeoutMs = 20000 } = {}) {
  // retrieve top-K by cosine similarity
  const qVector = await embed(question);
  const ranked = chunks
    .map((c) => ({ ...c, score: cosineSimilarity(qVector, c.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K);

  const sources = [...new Set(ranked.map((c) => c.source))];
  const context = ranked.map((c) => `[${c.source}] ${c.text}`).join('\n\n');
  const prompt = `Answer the question using ONLY the context below. If the answer isn't in the context, say you don't know. Cite the source in [brackets].

Context:
${context}

Question: ${question}
Answer:`;

  // TIMEOUT: if the LLM hangs, reject after timeoutMs (so we don't block forever)
  const chatPromise = ollama.chat({
    model: CHAT_MODEL,
    messages: [{ role: 'user', content: prompt }],
  });
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('LLM timeout')), timeoutMs),
  );

  const response = await Promise.race([chatPromise, timeout]);
  return { answer: response.message.content, sources };
}

module.exports = { ingest, ask };
