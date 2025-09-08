const express =require("express");
const fileUpload = require("../middleware/file-upload");

const tasksController = require("../controllers/tasks-controllers");
const checkAuth = require("../middleware/check-auth")
const router=express.Router();

router.get("/", tasksController.getAllTasks);
router.use(checkAuth);
router.post("/", fileUpload.single("image"), tasksController.createTask);

router.post("/connect/:taskId", tasksController.connectToTask);
// Reject connection
router.post("/reject/:taskId", tasksController.rejectConnection);
router.post("/accept/:taskId/:userId", tasksController.acceptConnection);
router.post("/cancel/:taskId", tasksController.cancelTaskRequest);
router.get("/inprogress", tasksController.getInProgressTasks);
router.get("/my", tasksController.getMyTasks);
// Close task
router.patch("/close/:taskId", tasksController.closeTask);

// Delete task
router.delete("/:taskId", tasksController.deleteTask);

// Edit task
router.patch("/:taskId", tasksController.updateTask);

module.exports=router