const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const HttpError = require("../models/http-error");

const User = require("../models/user");
const { sendEmail } = require("../utils/email");
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

// signup.js
const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError("Signup failed, please try again later", 500));
  }

  if (existingUser) {
    return next(new HttpError("User already exists, try with different credentials", 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Could not create user, please try again.", 500));
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: "uploads/images/default_avatar.png",
    isVerified: false, // Initially false until user confirms email
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Creating user failed, please try again later", 500));
  }

  // Generate confirmation token (expires in 24h)
  const confirmToken = jwt.sign(
    { userId: createdUser.id, email: createdUser.email },
    process.env.JWT_KEY,
    { expiresIn: "24h" }
  );

  // Confirmation link
  const confirmLink = `${process.env.FRONTEND_URL}/confirm-signup?token=${confirmToken}`;

  // Send confirmation email
  const emailOptions = {
    to: createdUser.email,
    subject: "Confirm Your Account - SwapTask",
    html: `
      <div style="font-family: Arial, sans-serif; text-align:center;">
        <h2>Welcome to SwapTask, ${createdUser.name} 🎉</h2>
        <p>Click below to confirm your account:</p>
        <a href="${confirmLink}" style="display:inline-block; margin-top:10px; padding:10px 20px; background:#28a745; color:white; text-decoration:none; border-radius:5px;">Confirm Account</a>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  };

  try {
    await sendEmail(emailOptions);
  } catch (err) {
    return next(new HttpError("Could not send confirmation email, try again later", 500));
  }

  res.status(201).json({ message: "Signup successful! Please check your email to confirm your account." });
};

// confirmSignupEmail.js
const confirmSignupEmail = async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return next(new HttpError("Invalid confirmation link", 400));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "Account already confirmed!" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Account confirmed successfully!" });
  } catch (err) {
    return next(new HttpError("Confirmation link is invalid or expired", 400));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError("Login failed, please try again later", 500));
  }

  if (!existingUser) {
    return next(new HttpError("Invalid credentials", 403));
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(new HttpError("Could not log you in", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid credentials", 403));
  }

  // Create JWT with userId, name, email
  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );
  } catch (err) {
    return next(new HttpError("Logging in failed", 500));
  }

  // Set secure cookie, do NOT send token or user info in body
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1 * 60 * 60 * 1000,
  });

  // Minimal response, no user details
  res.status(200).json({ message: "Login successful" });
  //res.json({message: "Logged in!",user: existingUser.toObject({ getters: true }),});
};

const getCurrentUser = async (req, res, next) => {
  const { userId } = req.userData; // Decoded from JWT

  try {
    const user = await User.findById(userId).select("name email");
    if (!user) return next(new HttpError("User not found", 404));

    res.status(200).json({ user: user.toObject({ getters: true }) });
  } catch (err) {
    return next(new HttpError("Fetching user failed", 500));
  }
};

const logout = (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only in prod
    sameSite: "strict",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

const updateUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const userId = req.userData.userId;

  let existingUser;
  try {
    existingUser = await User.findById(userId);
  } catch (err) {
    return next(
      new HttpError("User not available to update, please try again later", 500)
    );
  }

  if (!existingUser) {
    return next(new HttpError("User not found", 404));
  }

  // 2️⃣ Update fields if provided
  if (req.file && req.file.path) {
    // Delete old image
    const imagePath = existingUser.image;
    fs.unlink(imagePath, (err) => {
      if (err) console.log(err);
    });

    existingUser.image = req.file.path.replace(/\\/g, "/");
  }

  if (req.body.city !== undefined) existingUser.city = req.body.city;
  if (req.body.bio !== undefined) existingUser.bio = req.body.bio;
  if (req.body.offeredTask !== undefined)
    existingUser.offeredTask = Array.isArray(req.body.offeredTask)
      ? req.body.offeredTask
      : [req.body.offeredTask];
  if (req.body.requestedTask !== undefined)
    existingUser.requestedTask = Array.isArray(req.body.requestedTask)
      ? req.body.requestedTask
      : [req.body.requestedTask];

  // Optional: allow updating name or phone if needed
  if (req.body.name !== undefined) existingUser.name = req.body.name;
  if (req.body.phone !== undefined) existingUser.phone = req.body.phone;

  // 3️⃣ Save the user
  try {
    await existingUser.save();
  } catch (err) {
    return next(
      new HttpError("Updating user failed, please try again later", 500)
    );
  }

  // 4️⃣ Send response
  res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    city: existingUser.city,
    bio: existingUser.bio,
    offeredTask: existingUser.offeredTask,
    requestedTask: existingUser.requestedTask,
    image: existingUser.image,
    phone: existingUser.phone,
  });
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

const sendResetEmail = async (req, res, next) => {
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

const deleteUser = async (req, res, next) => {
  const { password } = req.body;
  const { email } = req.userData;
  console.log(req.body, req.userData)
  try {
    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new HttpError("User not found", 404));
    }

    // 2. Match password
    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      return next(new HttpError("Invalid email or password", 401));
    }

    // 3. Delete user
    await User.deleteOne({ _id: existingUser._id });

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    return next(new HttpError("Deleting user failed, please try again", 500));
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.confirmSignupEmail = confirmSignupEmail;
exports.login = login;
exports.updateUser = updateUser;
exports.getUserInfo = getUserInfo;
exports.sendResetEmail = sendResetEmail;
exports.updatePassword = updatePassword;
exports.getCurrentUser = getCurrentUser;
exports.logout = logout;
exports.deleteUser = deleteUser;

