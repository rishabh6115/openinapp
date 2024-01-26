const User = require("../modals/UserModal");
const asyncHandler = require("express-async-handler");
const generateToken = require("../generateToken");

const register = asyncHandler(async (req, res) => {
  const { phoneNum, password } = req.body;
  if (!phoneNum || !password) {
    throw new Error("Please Enter All the feilds");
  }

  const userExists = await User.findOne({ phone_number: phoneNum });
  console.log(userExists);
  if (userExists) {
    throw new Error("User Already Exists");
  }

  const user = await User.create({ phone_number: phoneNum, password });

  if (user) {
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      phone_number: user.phone_number,
      token: token,
    });
  } else {
    res.status("400").json({ error: "Failed to create user" });
  }
});

const login = asyncHandler(async (req, res) => {
  const { phoneNum, password } = req.body;

  if (!phoneNum || !password) {
    res.json({ error: "Please enter all the feilds" });
  }
  let phone_number = phoneNum;
  const user = await User.findOne({ phone_number });

  if (!user) {
    res.json({ error: "User not found" });
  }

  if (await user.matchPassword(password)) {
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      phone_number: user.phone_number,
      token: token,
    });
  } else {
    res.status("401").json({ error: "Invalid Credentials" });
  }
});

const getuser = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status("401").json({ error: "Invalid Credentials" });
  }

  res.send(req.user);
});

module.exports = { register, login, getuser };
