const express = require("express");
const router = express.Router();
const {authUser} = require("../middleware/user.auth");;
const { joinEvent, leaveEvent ,getMyJoinedEvents} = require("../controllers/rsvp.controller");

router.post("/:id/join", authUser, joinEvent);
router.delete("/:id/leave", authUser, leaveEvent);
router.get("/my", authUser, getMyJoinedEvents);


module.exports = router;
