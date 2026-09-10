// ===== MODULE 1: WebSocket echo server (Socket.IO) =====
// Run:  npm install   then   npm start
// Open: http://localhost:3000 in TWO browser tabs to see real-time.
//
// The flow:
//   1. Express serves the HTML client
//   2. Socket.IO opens a persistent WebSocket connection per client
//   3. When a client sends "message", the server handles it

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // serves public/index.html

// This fires every time a NEW client connects
io.on("connection", (socket) => {
  console.log("✅ a user connected:", socket.id);

  // MODULE 1 (done for you): echo the message back to the sender
  socket.on("message", (text) => {
    console.log("received:", text);
    socket.emit("message", `echo: ${text}`); // send back only to this client
  });

  // ----- MODULE 2 (your turn): broadcast to EVERYONE instead of echo -----
  // Replace socket.emit above with io.emit(...) to send to all connected clients.
  // TODO: try  io.emit("message", text)  and open 2 tabs — both should see it.

  // ----- MODULE 3 (your turn): rooms + presence -----
  // socket.on("join", (room) => { socket.join(room); ... });
  // io.to(room).emit("message", text);  // only people in that room

  socket.on("disconnect", () => {
    console.log("❌ a user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => console.log(`🚀 realtime app on http://localhost:${PORT}`));
