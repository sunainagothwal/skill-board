const express = require("express");
const { check } = require("express-validator");
const usersController = require("../controllers/users-controllers");

const router = express.Router();
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

// Public routes
router.get("/", usersController.getUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);
router.get("/confirm-signup-email/:token", usersController.confirmSignupEmail);
router.post("/login", usersController.login);
router.post("/reset-password", usersController.sendResetEmail);
router.post("/new-password", usersController.updatePassword);
router.post("/logout", usersController.logout);
//router.get("/:uid", usersController.getUserInfo);

// ✅ Protected routes (require cookie-based JWT auth)
router.use(checkAuth);

router.get("/me", usersController.getCurrentUser); // Get logged-in user

router.patch(
  "/updateUser",
  fileUpload.single("image"),
  usersController.updateUser
);
router.delete("/delete-account", usersController.deleteUser);
module.exports = router;
