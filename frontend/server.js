const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:4000",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

io.on("connection", function (socket) {
  console.log("User connected:", socket.id);

  socket.on("send-location", function (data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", function() {
    console.log("User disconnected:", socket.id);
    io.emit("user-disconnected", socket.id);
  });
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
