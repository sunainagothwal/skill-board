const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat-controller");
const checkAuth = require("../middleware/check-auth");

router.use(checkAuth);

// ✅ Threads
router.get("/threads", chatController.getChatThreads);

// ✅ Get chat history for a partner + task
router.get("/:partnerId/:taskId", chatController.getChatHistory);

// ✅ Send message to a partner (for specific task)
router.post("/:partnerId/:taskId", chatController.sendMessage);

// ✅ Unread count
router.get("/count", chatController.getUnreadChats);

// ✅ Mark partner chat as read
router.put("/read/:partnerId", chatController.markChatsRead);

module.exports = router;
