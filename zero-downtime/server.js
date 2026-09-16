// ===== Hands-on: Zero-Downtime with PM2 =====
// Shows: reload the app while requests keep flowing -> NO downtime.
// Setup: npm install express && npm install -g pm2
// Run:   pm2 start server.js -i 2 --name zdt   (2 instances / cluster)
// Reload (zero-downtime): pm2 reload zdt
// Watch: hammer the endpoint in a loop during reload -> no dropped requests.

const express = require("express");
const app = express();

// change this number, then `pm2 reload zdt` to simulate a new deploy
const VERSION = "v1";

// a normal endpoint (returns which worker + version served it)
app.get("/", (req, res) => {
  res.json({ version: VERSION, pid: process.pid, time: Date.now() });
});

// HEALTH CHECK — load balancers/orchestrators use this to know the instance is ready
app.get("/health", (req, res) => res.json({ status: "ok", pid: process.pid }));

const server = app.listen(4300, () =>
  console.log(`worker ${process.pid} listening on 4300 (${VERSION})`)
);

// GRACEFUL SHUTDOWN — on reload, finish in-flight requests before dying
process.on("SIGINT", () => {
  console.log(`worker ${process.pid} shutting down gracefully...`);
  server.close(() => {           // stop accepting new requests, finish current ones
    console.log(`worker ${process.pid} closed. bye.`);
    process.exit(0);
  });
});
