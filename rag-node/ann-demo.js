// ===== ANN concept demo: brute-force vs approximate search =====
// Shows WHY vector DBs use ANN: brute-force checks EVERY vector,
// approximate checks only a small "bucket" -> much faster at scale.
// Run:  node ann-demo.js
// (Real production uses HNSW via a library like hnswlib — this just shows the idea.)

// --- cosine similarity (same as your RAG) ---
function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// --- fake dataset: 8 product vectors (2D so it's easy to see) ---
const products = [
  { name: "beige bedsheet",   vec: [0.9, 0.1] },
  { name: "cream pillow",     vec: [0.85, 0.15] },
  { name: "white lamp",       vec: [0.8, 0.2] },
  { name: "blue rug",         vec: [0.1, 0.9] },
  { name: "navy curtain",     vec: [0.15, 0.85] },
  { name: "teal vase",        vec: [0.2, 0.8] },
  { name: "grey throw",       vec: [0.5, 0.5] },
  { name: "sand basket",      vec: [0.88, 0.12] },
];

const query = [0.9, 0.1]; // "cozy beige" -> points toward the beige cluster

// ============ 1) BRUTE FORCE: compare against ALL vectors ============
function bruteForce(query, products) {
  let checks = 0;
  const scored = products.map(p => { checks++; return { ...p, score: cosine(query, p.vec) }; });
  scored.sort((a, b) => b.score - a.score);
  return { top: scored.slice(0, 3), checks };
}

// ============ 2) APPROXIMATE (ANN idea): only search the nearby BUCKET ============
// Pre-group products into buckets once. At query time, only search the closest bucket.
// (HNSW does this smarter with a graph — same core idea: skip most vectors.)
const buckets = {
  warm: products.filter(p => p.vec[0] > 0.6),   // beige/cream cluster
  cool: products.filter(p => p.vec[1] > 0.6),   // blue/teal cluster
  mid:  products.filter(p => p.vec[0] <= 0.6 && p.vec[1] <= 0.6),
};

function approximate(query, buckets) {
  // pick the bucket whose "center" is closest to the query (cheap check)
  const bucketName = query[0] > 0.6 ? "warm" : query[1] > 0.6 ? "cool" : "mid";
  const candidates = buckets[bucketName];
  let checks = 0;
  const scored = candidates.map(p => { checks++; return { ...p, score: cosine(query, p.vec) }; });
  scored.sort((a, b) => b.score - a.score);
  return { top: scored.slice(0, 3), checks, bucketName };
}

// ---- run both ----
const bf = bruteForce(query, products);
console.log("BRUTE FORCE  → checked", bf.checks, "vectors (ALL of them)");
console.log("  top:", bf.top.map(p => p.name).join(", "));

const ann = approximate(query, buckets);
console.log(`\nAPPROXIMATE  → checked only ${ann.checks} vectors (bucket "${ann.bucketName}")`);
console.log("  top:", ann.top.map(p => p.name).join(", "));

console.log(`\n→ Same top results, but ANN checked ${ann.checks} instead of ${bf.checks}.`);
console.log("  At 150,000 products, that difference is HUGE. That's why vector DBs use ANN/HNSW.");
