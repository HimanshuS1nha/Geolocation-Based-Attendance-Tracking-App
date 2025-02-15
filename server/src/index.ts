import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const port = process.env.PORT || 8000;

io.on("connection", (socket) => {
  console.log(`${socket.id} Joined`);
});

app.get("/", (_, res) => {
  res.send("Hello World");
  return;
});

server.listen(port, () =>
  console.log(`Listenting on http://localhost:${port}`)
);
