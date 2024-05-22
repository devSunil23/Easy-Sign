const express = require("express");
const router = express.Router();
// signup
const { signupController } = require("../controller/auth/signup.js");
const { loginController } = require("../controller/auth/login.js");
router.post("/signup", signupController);
router.post("/login", loginController);
module.exports = router;
