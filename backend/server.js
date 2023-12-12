const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const socketIo = require("socket.io");
const io = socketIo(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});

io.on("connection", (socket) => {
  console.log(`${socket.id} user connected`);

  socket.on("esp32Message", (data) => {
    console.log(`Message from ESP32: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("ESP32 disconnected");
  });
});
