const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    task: { type: mongoose.Types.ObjectId, ref: "Task" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
