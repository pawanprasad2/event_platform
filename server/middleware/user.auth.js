const User = require("../models/user.model");
const blacklistedToken = require("../models/blacklistedToken.model");
const bcypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res,next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const isBlacklisted  = await blacklistedToken.findOne({ token: token });
    if (isBlacklisted ) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User Not Found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error({ "authentication error": error });
    return res.status(401).json({ message: "unauthorized" });
  }
};
