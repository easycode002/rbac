const express = require("express");
const router = express();

const authController = require("../controllers/auth.controller");

const { registerValidator, signinValidator } = require("../helpers/validator");

router.post("/signup", registerValidator, authController.registerUser);
router.post("/signin", signinValidator, authController.loginUser);

module.exports = router;
