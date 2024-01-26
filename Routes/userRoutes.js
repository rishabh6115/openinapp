const express = require("express");
const { register, login, getuser } = require("../Controllers/UserController");
const { auth } = require("../Middlewares/auth");
const router = express.Router();

router.route("/").post(register).get(auth, getuser);
router.route("/login").post(login);

module.exports = router;
