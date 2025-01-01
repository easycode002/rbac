const { validationResult } = require("express-validator");
const RoleModel = require("../../models/role.model");

const addRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    const { role_name, value } = req.body;
    const role = new RoleModel({
      role_name,
      value,
    });

    const roleData = await role.save();
    console.log("Role data::", roleData);

    return res.status(200).json({
      success: true,
      msg: "Role created successfully!",
      data: roleData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const getRole = async (req, res) => {
  try {
    const role = await RoleModel.find({
      value: {
        $ne: 1, //Admin
      },
    });

    return res.status(200).json({
      success: true,
      msg: "Role retriev successfully!",
      data: role,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};
module.exports = {
  addRole,
  getRole,
};
