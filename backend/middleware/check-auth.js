const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    // ✅ Read token from cookie instead of Authorization header
    const token = req.cookies?.token;
    if (!token) {
      throw new Error("Authentication failed!");
    }

    // ✅ Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    // ✅ Attach userId to request object for use in routes
    req.userData = { userId: decodedToken.userId,email:decodedToken.email,name:decodedToken.name };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed!", 403);
    return next(error);
  }
};
