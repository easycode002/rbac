const UserModel = require("../models/user.model");
const UserPermissionModel = require("../models/userpermission.model");
const Permission = require("../models/permission.model");

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

    // Assing defautl permission
    const defaultPermission = await Permission.find({ is_default: 1 });

    if (defaultPermission.length > 0) {
      const permissionArray = defaultPermission.map((permission) => ({
        permission_name: permission.permission_name,
        permission_value: [0, 1, 2, 3], // All CRUD operations
      }));

      const userPermission = new UserPermissionModel({
        user_id: (await userData)._id,
        permission: permissionArray,
      });

      await userPermission.save();
    }

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

    // Get user data with all permission
    const result = await UserModel.aggregate([
      {
        $match: {
          email: userData.email,
        },
      },
      {
        $lookup: {
          from: "userpermissions",
          localField: "_id",
          foreignField: "user_id",
          as: "permissions",
        },
      },
      {
        $project: {
          // _id: 0,
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          permissions: {
            $cond: {
              if: { $isArray: "$permissions" },
              then: { $arrayElemAt: ["$permissions", 0] },
              else: null,
            },
          },
        },
      },
      {
        $addFields: {
          permissions: {
            permissions: "$permissions.permissions",
          },
        },
      },
    ]);

    return res.status(400).json({
      success: true,
      msg: "Login successfully!",
      accessToken: accessToken,
      tokenType: "Bearer",
      data: result[0],
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user_id = req.user._id;
    const userData = await UserModel.findOne({ _id: user_id });
    return res.status(200).json({
      success: true,
      msg: "Profile data!",
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
  getProfile,
};
