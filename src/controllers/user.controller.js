const { validationResult } = require("express-validator");
const UserModel = require("../models/user.model");
const PermissionModel = require("../models/permission.model");
const UserPermissionModel = require("../models/userpermission.model");

const randomstring = require("randomstring");
const bcrypt = require("bcrypt");
const { sendMail } = require("../helpers/mail.validator");

const mongoose = require("mongoose");

const addUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    const { name, email } = req.body;
    const isExist = await UserModel.findOne({ email });

    if (isExist) {
      return res.status(400).json({
        success: false,
        msg: "User already exist!",
      });
    }

    // Generate password
    const password = randomstring.generate(6);
    const hashPassword = await bcrypt.hash(password, 10);

    var userObj = {
      name,
      email,
      password: hashPassword,
    };

    if (req.body.role && req.body.role == 1) {
      return res.status(400).json({
        success: false,
        msg: "You can't create Admin!",
      });
    } else if (req.body.role) {
      userObj.role = req.body.role;
    }

    const user = new UserModel(userObj);
    const userData = await user.save();

    // Add permission to user if comming in request.
    if (req.body.permission != undefined && req.body.permission.length > 0) {
      // console.log(`Test - Create user with permission!`);
      const addPermission = req.body.permission;
      const permissionArray = [];
      await Promise.all(
        addPermission.map(async (permission) => {
          const permissionData = await PermissionModel.findOne({
            _id: permission.id,
          });

          permissionArray.push({
            permission_name: permissionData.permission_name,
            permission_value: permission.value,
          });
        })
      );

      const userPermission = new UserPermissionModel({
        user_id: userData._id,
        permission: permissionArray,
      });

      await userPermission.save();
    }

    console.log("Password user::", password);

    const content =
      `
      <p>Hii <b>` +
      userData.name +
      `</b> Your account is created, below is your details.</p>
      <table style="border-style:none">
        <tr>
          <th>Name:-</th>
          <th>` +
      userData.name +
      `</th>
        </tr>
        <tr>
          <th>Email:-</th>
          <th>` +
      userData.email +
      `</th>
        </tr>
        <tr>
          <th>Password:-</th>
          <th>` +
      password +
      `</th>
        </tr>
      </table>
      <p>Now you can login your account is our application, Thanks...</p>
    `;

    const emailSent = await sendMail(
      userData.email,
      "Account created!",
      content
    );

    if (!emailSent) {
      console.error("Failed to send email to:", userData.email);
      return res.status(500).json({
        success: false,
        msg: "User created, but email could not be sent.",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "User create successfully!",
      data: userData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    // Get user data with all permission
    const users = await UserModel.aggregate([
      {
        $match: {
          _id: {
            $ne: new mongoose.Types.ObjectId(req.user._id),
          },
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

    console.log("Get user Id::", req.user._id);

    return res.status(200).json({
      success: true,
      msg: "Retriev user successfully!",
      data: users,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    // Specific update only on name
    const { id, name } = req.body;

    const isExist = await UserModel.findOne({ _id: id });

    // Check user existing or not.
    if (!isExist) {
      return res.status(400).json({
        success: false,
        msg: "User not found!",
      });
    }

    var updateObj = {
      name,
    };

    if (req.body.role != undefined) {
      updateObj.role = req.body.role;
    }

    const updatedData = await UserModel.findByIdAndUpdate(
      { _id: id },
      { $set: updateObj },
      { new: true }
    );

    // Add permission to user if comming in request.
    if (req.body.permission != undefined && req.body.permission.length > 0) {
      // console.log(`Test - Create user with permission!`);
      const addPermission = req.body.permission;
      const permissionArray = [];
      await Promise.all(
        addPermission.map(async (permission) => {
          const permissionData = await PermissionModel.findOne({
            _id: permission.id,
          });

          permissionArray.push({
            permission_name: permissionData.permission_name,
            permission_value: permission.value,
          });
        })
      );

      await UserPermissionModel.findOneAndUpdate(
        { user_id: updatedData._id },
        { permission: permissionArray },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return res.status(200).json({
      success: true,
      msg: "User updated successfully!",
      data: updatedData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    const { id } = req.body;

    const isExistCategory = await UserModel.findOne({ _id: id });
    if (!isExistCategory) {
      return res.status(404).json({
        success: false,
        msg: "User Id not found!",
      });
    }

    await UserModel.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      msg: "User delete successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = {
  addUser,
  getUser,
  updateUser,
  deleteUser,
};
