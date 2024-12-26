const express = require("express");
const router = express();

const auth = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");
const { registerValidator, signinValidator } = require("../helpers/validator");

router.post("/signup", registerValidator, authController.registerUser);
router.post("/signin", signinValidator, authController.loginUser);
router.get("/profile", auth, authController.getProfile);

module.exports = router;
