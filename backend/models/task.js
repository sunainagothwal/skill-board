const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    createdTask: [
      {
        taskGiven: {  type: String, required: true },
        taskTaken: {  type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports=mongoose.model('Task',taskSchema)