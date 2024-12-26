const UserModel = require("../models/user.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

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

module.exports = {
  registerUser,
};
