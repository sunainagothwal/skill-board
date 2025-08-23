
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
  console.log(createdTask);
  //console.log(req.body);
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
const getTasksByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userBets;
  try {
    userBets = await Bet.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(err);
    return next(err);
  }
  if (!userBets || userBets.length === 0) {
    return next(
      new HttpError("Could not find bets for the provided user id.", 404)
    );
  }

  /* const cleanedBets = existingUser.bets.map((bet) => ({
    date: bet.date,
    selectedBet: bet.selectedBet.map((sel) => ({
      amount: sel.amount,
      selectedNumber: sel.selectedNumber,
    })),
  })); */

  res.json(userBets);

  /* res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  }); */
};

const getAllTasks = async (req, res, next) => {
  let tasks;
  try {
    tasks = await Task.find()
      .populate("creator", "name") // only get creator's name
      .select(
        "title description requestedTask offeredTask location attachments deadline creator"
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
    creator: task.creator?.name || "Unknown",
  }));

  res.json({ tasks: transformedTasks });
};

exports.createTask = createTask;
exports.getTasksByUserId = getTasksByUserId;
exports.getAllTasks = getAllTasks;