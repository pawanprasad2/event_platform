const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { authUser } = require("../middleware/user.auth");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  userDashboard,
} = require("../controllers/user.controller");

router.post(
  "/signup",

  [
    body("email").isEmail().withMessage("invalid Email"),
    body("firstname")
      .isLength({ min: 3 })
      .withMessage("firstname must be 3 characters long"),

    body("password")
      .isLength({ min: 3 })
      .withMessage("password must be 3 characters long"),
  ],

  registerUser
);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("invalid Email"),
    body("password")
      .isLength({ min: 3 })
      .withMessage("password must be 3 characters long"),
  ],
  loginUser
);
router.post("/logout", authUser, logoutUser);
router.get("/profile", authUser, getUserProfile);
router.get("/dashboard", authUser, userDashboard);

module.exports = router;
