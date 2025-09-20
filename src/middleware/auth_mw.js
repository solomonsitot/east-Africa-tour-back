const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.send("Not authorized please login");
    const valid = jwt.verify(token, process.env.PRIVATE_SECERET_TOKEN);
    req.user = valid;
    next();
  } catch (ex) {
    res.send(ex);
  }
};