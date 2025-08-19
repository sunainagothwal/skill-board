const express =require("express");

const betsController = require("../controllers/tasks-controllers");
const checkAuth = require("../middleware/check-auth")
const router=express.Router();
router.get("/:uid", betsController.getBetsByUserId);
router.use(checkAuth);
router.post("/", betsController.createBetByUserId);

/*router.get("/user/:uid", placesController.getPlacesByUserId);
router.patch("/:pid", placesController.updatePlace);
router.delete("/:pid", placesController.deletePlace);
router.post("/bet/:uid", placesController.createBetByUserId); */
module.exports=router