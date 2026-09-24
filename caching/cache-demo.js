// ===== Hands-on: Redis caching (cache-aside pattern) =====
// Shows the real speed difference: 1st call is slow (DB), 2nd is instant (cache).
// Run:  docker run --name redis-demo -p 6379:6379 -d redis
//       npm install express ioredis
//       node cache-demo.js   ->  http://localhost:4200

const express = require("express");
const Redis = require("ioredis");

const app = express();
const redis = new Redis({ host: "127.0.0.1", port: 6379 }); // connect to Redis

// Pretend this is a SLOW database query (2 seconds)
function slowDatabaseQuery(id) {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ id, name: `Product ${id}`, price: 999 }), 2000)
  );
}

// GET /product/:id  — cache-aside pattern
app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const key = `product:${id}`;
  const start = Date.now();

  // 1) CHECK the cache first
  const cached = await redis.get(key);
  if (cached) {
    // CACHE HIT -> return instantly, no DB
    return res.json({
      source: "cache",
      ms: Date.now() - start,
      data: JSON.parse(cached),
    });
  }

  // 2) CACHE MISS -> hit the (slow) DB
  const data = await slowDatabaseQuery(id);

  // 3) STORE in cache with a TTL (expire after 30s), so next time it's fast
  await redis.set(key, JSON.stringify(data), "EX", 30);

  res.json({ source: "database (slow)", ms: Date.now() - start, data });
});

// clear a cache entry (invalidation on update)
app.delete("/product/:id/cache", async (req, res) => {
  await redis.del(`product:${req.params.id}`);
  res.json({ message: "cache cleared for " + req.params.id });
});

app.listen(4200, () => console.log("🚀 cache demo on http://localhost:4200"));
