const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");

const User = require("../models/user");
const { sendEmail } = require("../utils/email"); 
const DUMMY_USERS = [
  {
    id: "u1",
    name: "bhagi",
    email: "test@test.com",
    password: "testers",
  },
];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later",
      500
    );
    return next(error);
  }
  //find returns array
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
  //res.json({ users });
};

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  //const hasUser = DUMMY_USERS.find(u => u.email === email);
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Signup failed, please try again later", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User already exists, Please try with different credentials",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User(
    {
      name,
      email,
      password: hashedPassword,
      image: "uploads/images/default_avatar.png",
      places: [],
      bets: [],
    });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Creating user failed, please try again later",
      500
    );
    return next(error);
  }
 
  
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email,name:createdUser.name, token: token });


 // res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Login failed, please try again later", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, please try again later",
      500
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    name:existingUser.name,
    token: token,
  });

  //res.json({message: "Logged in!",user: existingUser.toObject({ getters: true }),});
};

// update user profile info
const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const userId = req.userData.userId;
  //console.log("in user update", req.file.path);
  let existingUser;
  try {
    //existingUser = await User.findOne(userId);
    existingUser = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("User not available to update, please try again later", 500);
    return next(error);
  }
   //console.log(existingUser);
  if (!existingUser) {
    const error = new HttpError(
      "User not found",
      404
    );
    return next(error);
  }
  //deleting the existing image of user before updating
  const imagePath= existingUser.image
  fs.unlink(imagePath,error=>{
    console.log(error);
  }) 
  existingUser.image = req.file.path.replace(/\\/g, "/");;
  //console.log(existingUser,"after image update")
  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError(
      "Updating user failed, please try again later",
      500
    );
    return next(error);
  }


  res.status(201).json({
    userId: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
  });

  // res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};
const getUserInfo = async (req, res, next) => {
  const userId = req.params.uid;
  let existingUser;
  try {
    //existingUser = await User.findOne(userId);
    existingUser = await User.findById(userId)
  } catch (err) {
    const error = new HttpError(
      "User info not available, please try again later",
      500
    );
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError("User not found", 404);
    return next(error);
  }
  
  const userInfo = {
    userId: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    image: existingUser.image,
    createdAt: existingUser.createdAt
  };

  res.status(201).json({userInfo});

};
const getWinnerInfo = async (req, res, next) => {
  let winnerInfo
  try {
     winnerInfo = await Result.findOne({}).sort({ createdAt: -1 });

  } catch (err) {
    const error = new HttpError(
      "Winner not found, please try again later",
      500
    );
    return next(error);
  }
  if (!winnerInfo) {
    const error = new HttpError("Winner not found", 404);
    return next(error);
  }
  const finalWinnerInfo = {
    winnerNumber: winnerInfo.winnerNumber,
    winners: winnerInfo.winners,
  };

  res.status(201).json(finalWinnerInfo);
};
const sendRestEmail = async (req, res, next) => {
  const emailToSendLink = req.body.email;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: emailToSendLink });
  } catch (err) {
    const error = new HttpError(
      "No user with provided email , please try again later",
      500
    );
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError("User not found with this email", 404);
    return next(error);
  }
  console.log(existingUser);
  token = jwt.sign(
    { name: existingUser.name, email: existingUser.email },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  );
  //console.log(process.env,"env value")
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const emailOptions = {
    to: existingUser.email,
    subject: "🔐 Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>Note: This link will expire in 1 hour.</p>
      </div>
    `,
  };
  try {
    await sendEmail(emailOptions);
    res.status(200).json({ message: "Reset link sent!" });
  } catch (err) {
    return next(new HttpError("Could not send email, try again later", 500));
  }
};

const updatePassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    const error = new HttpError("Invalid or expired token", 401);
    return next(error);
  }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: decodedToken.email });
  } catch (err) {
    const error = new HttpError(
      "No user found , please try again later",
      500
    );
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError("User not found with this email", 404);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not update password, please try again.",
      500
    );
    return next(error);
  }
  existingUser.password = hashedPassword;
  try {
    await existingUser.save();
  } catch (err) {
    const error = new HttpError("Saving new password failed", 500);
    return next(error);
  }
  res.status(200).json({ message: "Password updated successfully!" });
};
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.updateUser = updateUser;
exports.getUserInfo = getUserInfo;
exports.getWinnerInfo = getWinnerInfo;
exports.sendRestEmail = sendRestEmail;
exports.updatePassword = updatePassword;
