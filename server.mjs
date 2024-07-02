import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
let users = [];
let chats = [];

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    // Send all chat messages to the newly connected client
    socket.emit('initial-chats', chats);

    // Listen for chat messages from clients
    socket.on("chat", (message) => {
      try {
        const parsedMessage = JSON.parse(message); // Parse the message
  
        console.log("👁️ : Message received: ", parsedMessage);
  
        io.emit("chat", parsedMessage);
        chats.push(parsedMessage);
      } catch (error) {
        console.error("Error parsing message: ", error);
      }
    });

    socket.on("newUser", (data) => {
      // Adds the new user to the list of users
      users.push({ ...data, socketID: socket.id });
      // Sends the list of users to the client
      io.emit("newUserResponse", users);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`🔥: ${socket.id} user just disconnected!`);
      users = users.filter((user) => user.socketID !== socket.id);
      // Sends the list of users to the client
      io.emit("newUserResponse", users);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});