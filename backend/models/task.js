const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requestedTask: { type: [{ type: String, required: true }] }, // array of strings
    offeredTask: { type: [{ type: String, required: true }] }, // array of strings
    location: { type: String, required: true },
    attachments: { type: String }, // or use Buffer if storing files
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "cancelled"],
      default: "open",
    },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
