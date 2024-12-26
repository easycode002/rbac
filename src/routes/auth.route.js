const express = require("express");
const router = express();

const authController = require("../controllers/auth.controller");

const { registerValidator } = require("../helpers/validator");

router.post("/signup", registerValidator, authController.registerUser);

module.exports = router;
