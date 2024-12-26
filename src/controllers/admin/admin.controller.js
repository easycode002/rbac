const { validationResult } = require("express-validator");
const PermissionModal = require("../../models/permission.model");

const createPermission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    const { permission_name } = req.body;

    const isExist = await PermissionModal.findOne({ permission_name });
    if (isExist) {
      return res.status(400).json({
        success: false,
        msg: "Permission name already exists!",
      });
    }

    var obj = {
      permission_name,
    };

    if (req.body.default) {
      obj.is_default = parseInt(req.body.default);
    }

    const permission = new PermissionModal(obj);
    const newPermission = await permission.save();

    return res.status(200).json({
      success: false,
      msg: "Permission added successfully!",
      data: newPermission,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = {
  createPermission,
};
