const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "10d",
  });
};

module.exports = generateToken;
