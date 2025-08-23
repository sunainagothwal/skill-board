const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    city: { type: String, default: "Not set" },
    bio: { type: String, default: "No bio provided" },
    phone: { type: String, default: "" },
    offeredTask: [{ type: String }], // array of offered task strings
    requestedTask: [{ type: String }], // array of requested task strings
    tasks: [{ type: mongoose.Types.ObjectId, ref: "Task" }], // existing
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
