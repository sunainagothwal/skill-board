
const { default: mongoose } = require('mongoose');
const HttpError = require('../models/http-error');

const Task=require('../models/task');
const User=require("../models/user")


//create Task
const createTask = async (req, res, next) => {
  const { title, description, requestedTask, offeredTask, location, deadline } = req.body;

  const filePath = req.file ? req.file.path.replace(/\\/g, "/") : "";

  const createdTask = new Task({
    title,
    description,
    requestedTask,
    offeredTask,
    location,
    deadline,
    attachments: filePath,
    creator: req.userData.userId,
  });
  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Creating task failed", 500);
    return next(err);
  }

  if (!user) {
    const error = new HttpError("Couldn't find user for provided id", 404);
    return next(error);
  }
  //console.log("user",user);
  if (user.id.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to add this task.", 401);
    return next(error);
  }

  try {
    //await createdPlace.save();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdTask.save({ session: sess });
    // here push is not js push, it's mongoose push method which kind of allow mongoose to make a relation between 2 models (between user and places).
    //here mongoose grabs the created place id and add it to the places field of user
    user.tasks.push(createdTask);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating task failed", 500);
    /* const imagePath = existingUser.image;
    fs.unlink(imagePath, (error) => {
      console.log(error);
    });
    existingUser.image = req.file.path.replace(/\\/g, "/"); */
    return next(err);
  }

  res.status(201).json({ task: createdTask });
};

/* const getAllTasks = async (req, res, next) => {
  let tasks;
  try {
    tasks = await Task.find()
      .populate("creator", "name image") // only get creator's name
      .select(
        "title description requestedTask offeredTask location attachments deadline creator createdAt"
      );
  } catch (err) {
    const error = new HttpError("Fetching tasks failed", 500);
    return next(error);
  }

  if (!tasks || tasks.length === 0) {
    return next(new HttpError("No tasks found", 404));
  }

  // Map tasks and pick only the fields you want
  const transformedTasks = tasks.map((task) => ({
    title: task.title,
    description: task.description,
    requestedTask: task.requestedTask,
    offeredTask: task.offeredTask,
    location: task.location,
    attachments: task.attachments,
    deadline: task.deadline,
    createdAt: task.createdAt,
    creator: {
      name: task.creator?.name || "Unknown",
      image: task.creator?.image || null,
    },
  }));

  res.json({ tasks: transformedTasks });
}; */

const getAllTasks = async (req, res, next) => {
  let tasks;
  try {
    tasks = await Task.find()
      .populate("creator", "name image")
      .populate("connections.user", "name image") // populate users in connections
      .select(
        "title description requestedTask offeredTask location attachments deadline creator createdAt status connections"
      );
  } catch (err) {
    const error = new HttpError("Fetching tasks failed", 500);
    return next(error);
  }

  if (!tasks || tasks.length === 0) {
    return next(new HttpError("No tasks found", 404));
  }

  const transformedTasks = tasks.map((task) => ({
    _id: task._id,
    title: task.title,
    description: task.description,
    requestedTask: task.requestedTask,
    offeredTask: task.offeredTask,
    location: task.location,
    attachments: task.attachments,
    deadline: task.deadline,
    createdAt: task.createdAt,
    status: task.status,
    creator: {
      _id: task.creator?._id || null,
      name: task.creator?.name || "Unknown",
      image: task.creator?.image || null,
    },
    connections: task.connections.map((conn) => ({
      user: {
        _id: conn.user?._id || null,
        name: conn.user?.name || "Unknown",
        image: conn.user?.image || null,
      },
      status: conn.status,
    })),
  }));

  res.json({ tasks: transformedTasks });
};

// Connect request
const connectToTask = async (req, res, next) => {
  const { taskId } = req.params;
  const { userId } = req.userData;

  try {
    const task = await Task.findById(taskId).populate("creator", "name");
    if (!task) return next(new HttpError("Task not found", 404));

    // Check if already requested
    const existingRequest = task.connections.find(
      (c) => c.user.toString() === userId
    );
    if (existingRequest)
      return next(new HttpError("You have already requested this task", 400));

    // Add connection request
    task.connections.push({ user: userId, status: "pending" });
    await task.save();

    res.status(200).json({
      message: "Connection request sent successfully",
      requesterName: req.userData.name || "Someone",
    });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Failed to send connection request", 500));
  }
};

// cancel your connect request
const cancelTaskRequest = async (req, res, next) => {
  const { userId } = req.userData;
  const { taskId } = req.params;

  let task;
  try {
    task = await Task.findById(taskId).populate(
      "connections.user",
      "name image"
    );
  } catch (err) {
    return next(new HttpError("Fetching task failed, please try again", 500));
  }

  if (!task) {
    return next(new HttpError("Task not found", 404));
  }

  // Find the connection request made by the logged-in user
  const connectionIndex = task.connections.findIndex(
    (conn) => conn.user._id.toString() === userId && conn.status === "pending"
  );

  if (connectionIndex === -1) {
    return next(new HttpError("No pending request found to cancel", 404));
  }

  // Remove the connection request
  task.connections.splice(connectionIndex, 1);

  try {
    await task.save();
  } catch (err) {
    return next(
      new HttpError("Canceling request failed, please try again", 500)
    );
  }

  res.status(200).json({ message: "Request canceled successfully" });
};
// Reject request
const rejectConnection = async (req, res, next) => {
  const { taskId } = req.params;
 const { userId } = req.userData;

  try {
    const task = await Task.findById(taskId).populate("creator", "name");
    if (!task) return next(new HttpError("Task not found", 404));

    // Find the connection request
    const connection = task.connections.find(
      (c) => c.user.toString() === userId && c.status === "pending"
    );
    if (!connection)
      return next(new HttpError("No pending request found to reject", 400));

    // Mark as rejected
    connection.status = "rejected";
    await task.save();

    res.status(200).json({
      message: "Connection request rejected",
      requesterName: req.userData.name || "Someone",
    });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Failed to reject connection request", 500));
  }
};

const acceptConnection = async (req, res, next) => {
  const { taskId, userId } = req.params;
  const currentUser = req.userData.userId; // user performing the accept action

  try {
    const task = await Task.findById(taskId).populate("creator", "name");
    if (!task) return next(new HttpError("Task not found", 404));

    // Only the creator of the task can accept requests
    if (task.creator._id.toString() !== currentUser) {
      return next(new HttpError("You are not authorized to accept this request", 403));
    }

    // Find the connection request
    const connection = task.connections.find(
      (c) => c.user.toString() === userId && c.status === "pending"
    );
    if (!connection) {
      return next(new HttpError("No pending connection request found", 400));
    }

    // Mark as accepted
    connection.status = "accepted";
    task.status = "in-progress"; // change task status
    await task.save();

    res.status(200).json({
      message: "Connection request accepted successfully",
      requesterName: connection.user.name || "Someone",
    });
  } catch (err) {
    console.error(err);
    return next(new HttpError("Failed to accept connection request", 500));
  }
};


const getInProgressTasks = async (req, res, next) => {
  const { userId } = req.userData;
  let tasks;
  try {
    tasks = await Task.find()
      .populate("creator", "name image")
      .populate("connections.user", "name image") // populate user inside connections
      .select("title description creator connections status createdAt");
  } catch (err) {
    return next(new HttpError("Fetching tasks failed, please try again", 500));
  }

  if (!tasks || tasks.length === 0) {
    return res.json({ sentRequests: [], receivedRequests: [] });
  }

  // --- SENT Requests: Logged-in user requested someone else's task ---
  const sentRequests = [];
  // --- RECEIVED Requests: Someone else requested logged-in user's task ---
  const receivedRequests = [];

  tasks.forEach((task) => {
    // Check connections for each task
    task.connections.forEach((conn) => {
      if (
        conn.user &&
        conn.user._id.toString() === userId &&
        conn.status === "pending"
      ) {
        // Sent request: user requested this task
        sentRequests.push({
          ...formatTask(task),
          connectionStatus: conn.status,
        });
      }

      if (
        task.creator &&
        task.creator._id.toString() === userId &&
        conn.status === "pending"
      ) {
        // Received request: someone requested my task
        receivedRequests.push({
          ...formatTask(task),
          requestedBy: {
            id: conn.user._id,
            name: conn.user.name,
            image: conn.user.image || null,
          },
          connectionStatus: conn.status,
        });
      }
    });
  });

  res.json({ sentRequests, receivedRequests });
};

// Helper to format task info
const formatTask = (task) => ({
  _id: task._id,
  title: task.title,
  description: task.description,
  createdAt: task.createdAt,
  creator: {
    id: task.creator?._id || null,
    name: task.creator?.name || "Unknown",
    image: task.creator?.image || null,
  },
});


exports.createTask = createTask;
exports.getAllTasks = getAllTasks;
exports.connectToTask = connectToTask;
exports.cancelTaskRequest = cancelTaskRequest;
exports.rejectConnection = rejectConnection;
exports.acceptConnection = acceptConnection;
exports.getInProgressTasks = getInProgressTasks;