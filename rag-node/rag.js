// ===== A simple RAG in Node.js (local + free, using Ollama) =====
// "Chat with your documents": ingest docs -> retrieve relevant chunks -> LLM answers grounded.
// Run:  node rag.js "your question here"

const fs = require("fs");
const path = require("path");
const ollama = require("ollama").default;

const DOCS_DIR = path.join(__dirname, "docs");
const EMBED_MODEL = "nomic-embed-text"; // dedicated embedding model (turns text into vectors)
const CHAT_MODEL = "llama3.2";          // chat model (generates the answer)
const TOP_K = 3;                 // how many chunks to retrieve

// ---------- INGEST: load -> chunk -> embed ----------

// load all .md/.txt files from ./docs
function loadDocs() {
  const files = fs.readdirSync(DOCS_DIR).filter((f) => /\.(md|txt)$/.test(f));
  return files.map((f) => ({ source: f, text: fs.readFileSync(path.join(DOCS_DIR, f), "utf8") }));
}

// split a document into chunks by blank lines (paragraphs / sections)
function chunkText(text) {
  return text
    .split(/\n\s*\n/)          // split on blank lines
    .map((c) => c.trim())
    .filter((c) => c.length > 30); // drop tiny fragments
}

// turn a piece of text into a vector using Ollama
async function embed(text) {
  const res = await ollama.embeddings({ model: EMBED_MODEL, prompt: text });
  return res.embedding;
}

// ---------- RETRIEVE: cosine similarity ----------

// cosine similarity = how similar two vectors' directions are (1 = identical meaning)
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ---------- MAIN ----------

async function main() {
  const question = process.argv.slice(2).join(" ");
  if (!question) {
    console.log('Usage: node rag.js "your question"');
    return;
  }

  // 1) INGEST — load docs, chunk them, embed each chunk
  console.log("📥 ingesting documents...");
  const docs = loadDocs();
  const chunks = [];
  for (const doc of docs) {
    for (const piece of chunkText(doc.text)) {
      chunks.push({ source: doc.source, text: piece, vector: await embed(piece) });
    }
  }
  console.log(`   indexed ${chunks.length} chunks from ${docs.length} docs`);

  // 2) RETRIEVE — embed the question, find the most similar chunks
  const qVector = await embed(question);
  const ranked = chunks
    .map((c) => ({ ...c, score: cosineSimilarity(qVector, c.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K);

  // 3) GENERATE — give the retrieved chunks to the LLM as context
  const context = ranked.map((c) => `[${c.source}] ${c.text}`).join("\n\n");
  const prompt = `Answer the question using ONLY the context below. If the answer isn't in the context, say you don't know. Cite the source in [brackets].

Context:
${context}

Question: ${question}
Answer:`;

  const response = await ollama.chat({
    model: CHAT_MODEL,
    messages: [{ role: "user", content: prompt }],
  });

  console.log("\n🤖 Answer:\n" + response.message.content);
  // de-duplicate sources with a Set, so the same file isn't listed multiple times
  const uniqueSources = [...new Set(ranked.map((c) => c.source))];
  console.log("\n📚 Retrieved from:", uniqueSources.join(", "));
}

main().catch((err) => {
  console.error("❌ error:", err.message);
  process.exit(1);
});
