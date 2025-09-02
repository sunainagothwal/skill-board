const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requestedTask: { type: [{ type: String, required: true }] },
    offeredTask: { type: [{ type: String, required: true }] },
    location: { type: String, required: true },
    attachments: { type: String },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "cancelled"],
      default: "open",
    },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },

    // New field to store connection requests
    connections: [
      {
        user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
