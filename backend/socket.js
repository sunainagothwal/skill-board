const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    // When user joins their room (userId)
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined their room`);
    });

    // When a message is sent
    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
      console.log(`📨 Message from ${senderId} to ${receiverId}: ${message}`);

      // Send to receiver's room
      io.to(receiverId).emit("receiveMessage", { senderId, message });

      // Optional: You can also emit to sender for message confirmation
      io.to(senderId).emit("messageSent", { receiverId, message });
    });

    socket.on("disconnect", () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSocket, getIO };
