const User = require("../models/user.model");
const blacklistToken = require("../models/blacklistedToken.model");
const Event = require("../models/event.model");
const RSVP = require("../models/rsvp.model");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exist" });
    }

    const hashedPassword = await User.hashPassword(password);

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    const token = newUser.generateJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("signup error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser)
      return res.status(401).json({ message: "invalid email or password" });

    const isMatch = await existingUser.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    const token = existingUser.generateJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: existingUser._id,
        firstname: existingUser.firstname,
        lastname: existingUser.lastname,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.error({ "login error": error });
    res.status(500).json({ message: "internal server error" });
  }
};
module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (token) await blacklistToken.create({ token });
    res.status(200).json({ message: "logged out" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports.checkAuth = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports.userDashboard = async (req, res) => {
  const createdEvents = await Event.find({ createdBy: req.user._id });
  const attending = await RSVP.find({ user: req.user._id }).populate("event");

  res.json({ createdEvents, attending });
};
