const express =require("express");
const { check } = require("express-validator");
const usersController = require("../controllers/users-controllers");

const router=express.Router();
const HttpError = require("../models/http-error");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");
router.get("/", usersController.getUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],usersController.signup
);
router.post("/login", usersController.login);
router.post("/reset-password", usersController.sendRestEmail);
router.post("/new-password", usersController.updatePassword);
router.get("/:uid", usersController.getUserInfo);
router.use(checkAuth);
router.patch(
  "/updateUser",
  fileUpload.single("image"),
  usersController.updateUser
); 

module.exports=router
