import express, { Request, Response } from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const randomNames = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Emma",
  "Frank",
  "Grace",
  "Henry",
];

const usedNames = new Set();
const users = new Map(); // username -> socket.id
const userSockets = new Map(); // socket.id -> username

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

function getRandomName() {
  const availableNames = randomNames.filter((name) => !usedNames.has(name));

  if (availableNames.length === 0) {
    return `User${Math.floor(Math.random() * 1000)}`;
  }

  const randomIndex = Math.floor(Math.random() * availableNames.length);
  return availableNames[randomIndex];
}

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the server!");
});

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  const randomName = getRandomName();
  usedNames.add(randomName);

  userSockets.set(socket.id, randomName);
  users.set(randomName, socket.id);

  socket.emit("assigned-name", randomName);

  io.emit("all-users", Array.from(users.keys()));

  console.log(`Assigned name "${randomName}" to ${socket.id}`);
  console.log("Current users:", Array.from(users.keys()));

  socket.on("message", (data) => {
    const senderName = userSockets.get(socket.id);

    const messageData = {
      text: data.data || data, 
      sender: senderName,
      timestamp: Date.now(),
    };

    console.log(`Message from ${senderName}: ${messageData.text}`);
    io.emit("message", messageData);
  });

  socket.on("disconnect", () => {
    const username = userSockets.get(socket.id);
    if (username) {
      console.log(`User "${username}" disconnected`);
      usedNames.delete(username);
      users.delete(username);
      userSockets.delete(socket.id);
      io.emit("all-users", Array.from(users.keys()));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
