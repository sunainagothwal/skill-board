
const { default: mongoose } = require('mongoose');
const HttpError = require('../models/http-error');

const Bet=require('../models/task')
const User=require("../models/user")
//const { formatDate } = require("../utils");

//create Bet
const createBetByUserId = async (req, res, next) => {
  const { selectedBet } = req.body;
  //console.log("req body", req.body,req.userData);
  // const title = req.body.title;
  const createdBet = new Bet({
    selectedBet,
    creator:req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("Creating bet failed", 500);
    return next(err);
  }

  if (!user) {
    const error = new HttpError("Couldn't find user for provided id", 404);
    return next(error);
  }
  //console.log("user",user);
   if (user.id.toString() !== req.body.creator) {
    const error = new HttpError("You are not allowed to add this bet.", 401);
    return next(error);
  } 

  try {
    //await createdPlace.save();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdBet.save({ session: sess });
    // here push is not js push, it's mongoose push method which kind of allow mongoose to make a relation between 2 models (between user and places).
    //here mongoose grabs the created place id and add it to the places field of user
    user.bets.push(createdBet);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating bet failed", 500);
    return next(err);
  }

  res.status(201).json({ bet: createdBet });
};
const getBetsByUserId = async (req, res, next) => {
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

/* exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId; */
exports.createBetByUserId = createBetByUserId;
exports.getBetsByUserId = getBetsByUserId;