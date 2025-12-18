const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { authUser } = require("../middleware/user.auth");
const controller = require("../controllers/event.controller");

router.get("/", controller.getEvents);
router.get("/:id", controller.getEventById);
router.post("/", authUser, upload.single("image"), controller.createEvent);
router.put("/:id", authUser, upload.single("image"), controller.updateEvent);
router.delete("/:id", authUser, controller.deleteEvent);

module.exports = router;