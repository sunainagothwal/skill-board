const Notification = require("../models/notification");
const User = require("../models/user"); // ✅ import User model
const HttpError = require("../models/http-error");

// 📌 Get notifications for logged-in user
const getNotifications = async (req, res, next) => {
  const { userId } = req.userData;

  try {
    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "name image")
      .sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (err) {
    return next(new HttpError("Fetching notifications failed", 500));
  }
};

// 📌 Mark notifications as read
const markAsRead = async (req, res, next) => {
  const { userId } = req.userData;

  try {
    await Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    return next(new HttpError("Marking notifications failed", 500));
  }
};

// 📌 Helper function to create a notification
const createNotification = async ({ recipient, sender, message }) => {
  try {
    // ✅ Fetch sender details for name
    const senderUser = await User.findById(sender).select("name");

    const personalizedMessage = senderUser
      ? `${senderUser.name} ${message}`
      : message;

    const notif = new Notification({
      recipient,
      sender,
      message: personalizedMessage,
    });

    await notif.save();
    return notif;
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

exports.getNotifications = getNotifications;
exports.markAsRead = markAsRead;
exports.createNotification = createNotification;
