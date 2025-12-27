const mongoose = require("mongoose");
const ChatMessage = require("../models/chat-message");

// ✅ Get all chat threads (latest message + unread count)
const getChatThreads = async (req, res) => {
  try {
    if (!req.userData?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = new mongoose.Types.ObjectId(req.userData.userId);

    const threads = await ChatMessage.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },

      { $sort: { createdAt: -1 } },

      // normalize users order (A,B == B,A)
      {
        $addFields: {
          users: {
            $cond: [
              { $lt: ["$sender", "$receiver"] },
              ["$sender", "$receiver"],
              ["$receiver", "$sender"],
            ],
          },
        },
      },

      {
        $group: {
          _id: {
            task: "$task",
            users: "$users",
          },
          latestMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", userId] },
                    { $eq: ["$read", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      // ---------- POPULATE VIA LOOKUP ----------
      {
        $lookup: {
          from: "users",
          localField: "latestMessage.sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "latestMessage.receiver",
          foreignField: "_id",
          as: "receiver",
        },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "latestMessage.task",
          foreignField: "_id",
          as: "task",
        },
      },

      {
        $addFields: {
          "latestMessage.sender": { $arrayElemAt: ["$sender", 0] },
          "latestMessage.receiver": { $arrayElemAt: ["$receiver", 0] },
          "latestMessage.task": { $arrayElemAt: ["$task", 0] },
        },
      },

      {
        $project: {
          sender: 0,
          receiver: 0,
          task: 0,
        },
      },

      { $sort: { "latestMessage.createdAt": -1 } },
    ]);

    res.json({ threads });
  } catch (err) {
    console.error("🔥 Chat threads error:", err);
    res.status(500).json({ message: "Failed to fetch chat threads" });
  }
};

/* const getChatThreads = async (req, res) => {
  try {
    if (!req.userData?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = new mongoose.Types.ObjectId(req.userData.userId);

    const threads = await ChatMessage.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          senderStr: { $toString: "$sender" },
          receiverStr: { $toString: "$receiver" },
        },
      },
      {
        $addFields: {
          sortedUsers: {
            $cond: [
              { $lt: ["$senderStr", "$receiverStr"] },
              ["$sender", "$receiver"],
              ["$receiver", "$sender"],
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            task: "$task",
            users: "$sortedUsers",
          },
          latestMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiver", userId] },
                    { $eq: ["$read", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { "latestMessage.createdAt": -1 } },
    ]);

    if (threads.length > 0) {
      await ChatMessage.populate(threads, [
        { path: "latestMessage.sender", select: "name image" },
        { path: "latestMessage.receiver", select: "name image" },
        { path: "latestMessage.task", select: "title description" },
      ]);
    }

    res.json({ threads });
  } catch (err) {
    console.error("🔥 Chat threads error:", err);
    res.status(500).json({ message: "Failed to fetch chat threads" });
  }
}; */

// ✅ Get full chat history with a partner (for a task)
const getChatHistory = async (req, res) => {
  const { userId } = req.userData;
  const { partnerId, taskId } = req.params;

  try {
    const messages = await ChatMessage.find({
      task: taskId,
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name image")
      .populate("receiver", "name image");

    res.json({ messages });
  } catch (err) {
    console.error("❌ getChatHistory error:", err);
    res.status(500).json({ message: "Fetching chat history failed" });
  }
};

// ✅ Total unread count across all chats
const getUnreadChats = async (req, res) => {
  const { userId } = req.userData;
  try {
    const unread = await ChatMessage.find({ receiver: userId, read: false });
    res.json({ unreadCount: unread.length });
  } catch (err) {
    console.error("❌ getUnreadChats error:", err);
    res.status(500).json({ message: "Failed to fetch unread chats" });
  }
};

// ✅ Mark all messages with a partner as read
const markChatsRead = async (req, res) => {
  const { userId } = req.userData;
  const { partnerId } = req.params;
  try {
    await ChatMessage.updateMany(
      { receiver: userId, sender: partnerId, read: false },
      { $set: { read: true } }
    );
    res.json({ message: "Chats marked as read" });
  } catch (err) {
    console.error("❌ markChatsRead error:", err);
    res.status(500).json({ message: "Failed to mark chats as read" });
  }
};

// ✅ Send a new message (for a specific task + user)
const sendMessage = async (req, res) => {
  try {
    const senderId = req.userData.userId;
    const { partnerId, taskId } = req.params;
    const { message } = req.body;

    if (!message || !partnerId) {
      return res.status(400).json({ message: "Message and partnerId required" });
    }

    const chatMessage = new ChatMessage({
      sender: senderId,
      receiver: partnerId,
      task: taskId,
      message,
      read: false,
    });

    await chatMessage.save();

    const populatedMessage = await chatMessage.populate([
      { path: "sender", select: "name image" },
      { path: "receiver", select: "name image" },
      { path: "task", select: "title description" },
    ]);

    // ✅ IMPORTANT: return newMessage
    res.status(201).json({ newMessage: populatedMessage });
  } catch (err) {
    console.error("❌ sendMessage error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};


exports.getChatThreads = getChatThreads;
exports.getChatHistory = getChatHistory;
exports.getUnreadChats = getUnreadChats;
exports.markChatsRead = markChatsRead;
exports.sendMessage = sendMessage;
