const UserModel = require("../models/user.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;
    const isExistUser = await UserModel.findOne({ email });
    if (isExistUser) {
      return res.status(200).json({
        success: false,
        msg: "Email already exists!",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password::", hashedPassword);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    // Save new user
    const userData = newUser.save();

    return res.status(200).json({
      success: true,
      msg: "Sign up successfull!",
      data: newUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

// Generate access token
const generateAccessToken = async (user) => {
  const token = jwt.sign(user, "secret_token_somethings", {
    expiresIn: "2h",
  });
  console.log("ACCESS_SECRET_TOKEN:", process.env.ACCESS_SECRET_TOKEN);
  return token;
};

// Function handle signin/login
const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        msg: "Errors",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    const userData = await UserModel.findOne({ email });
    if (!userData) {
      return res.status(400).json({
        success: false,
        msg: "Email or Password is incorrect!",
      });
    }

    const isPassword = await bcrypt.compare(password, userData.password);
    if (!isPassword) {
      return res.status(400).json({
        success: false,
        msg: "Email or Password is incorrect!",
      });
    }

    // Generate new access token
    const accessToken = await generateAccessToken({ user: userData });

    return res.status(400).json({
      success: true,
      msg: "Login successfully!",
      accessToken: accessToken,
      tokenType: "Bearer",
      data: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};
module.exports = {
  registerUser,
  loginUser,
};
