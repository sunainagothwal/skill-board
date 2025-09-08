const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notifications-controller");
const checkAuth = require("../middleware/check-auth");

// ✅ Protect all notification routes
router.use(checkAuth);
// ✅ Get all notifications for logged-in user
router.get("/", notificationsController.getNotifications);

// ✅ Mark notifications as read
router.post("/mark-read", notificationsController.markAsRead);

module.exports = router;
