const express =require("express");
const fileUpload = require("../middleware/file-upload");

const tasksController = require("../controllers/tasks-controllers");
const checkAuth = require("../middleware/check-auth")
const router=express.Router();
router.get("/:uid", tasksController.getTasksByUserId);
router.get("/", tasksController.getAllTasks);
router.use(checkAuth);
router.post("/", fileUpload.single("image"), tasksController.createTask);
/*router.get("/user/:uid", placesController.getPlacesByUserId);
router.patch("/:pid", placesController.updatePlace);
router.delete("/:pid", placesController.deletePlace);
router.post("/bet/:uid", placesController.createBetByUserId); */
module.exports=router