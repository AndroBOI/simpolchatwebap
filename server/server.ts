import express, { Request, Response } from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the server!");
});

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("message", (data) => {
    console.log("Received message: ", data);
    io.emit("message", data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
