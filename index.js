const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: "*",
  methods: ["GET", "POST", "PUT"],
});

const users = [{}];

io.on("connection", (socket) => {
  socket.on("join", (user) => {
    users[socket.id] = user;
    socket.broadcast.emit("Hello", {
      user: users[socket.id],
      message: "Joined",
    });
  });
  socket.on("message", (data) => {
    io.emit("send", {
      user: users[data.id],
      message: data.message,
    });
  });
  socket.on("disconnect", () => {
    io.emit("left", {
      user: users[socket.id],
      message: "I am leaving...",
    });
  });
});

server.listen(5000, () => {
  console.log("listening on 5000");
});
