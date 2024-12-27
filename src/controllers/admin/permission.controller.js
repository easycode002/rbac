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

const getPermission = async (req, res) => {
  try {
    const permissions = await PermissionModal.find({});
    return res.status(200).json({
      success: true,
      msg: "Get permission successfully!",
      data: permissions,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const deletePermission = async (req, res) => {
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
    await PermissionModal.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      msg: "Permission delete successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const updatePermission = async (req, res) => {
  try {
    // Step 1: Validate check
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    // Step 2: Define way to request body that include id and permission_name
    const { id, permission_name } = req.body;

    // Step 3: Check if permission existing via Id
    const isExist = await PermissionModal.findOne({ _id: id });
    if (!isExist) {
      return res.status(400).json({
        success: false,
        msg: "Permission Id not found!",
      });
    }

    // Step 4: Make sure permission name is no duplicate
    const isNameAssigned = await PermissionModal.findOne({
      _id: { $ne: id },
      permission_name,
    });
    if (isNameAssigned) {
      return res.status(400).json({
        success: false,
        msg: `Permission name:${permission_name} already assigned to another permission!`,
      });
    }

    var updatePermission = {
      permission_name,
    };

    if (req.body.default != null) {
      // 1 = true, 0 = false
      updatePermission.is_default = parseInt(req.body.default);
    }

    const updatedPermission = await PermissionModal.findByIdAndUpdate(
      { _id: id },
      {
        $set: updatePermission,
      },
      { new: true }
    );

    return res.status(200).json({
      success: false,
      msg: "Permission updated successfully!",
      data: updatedPermission,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Permission Id not found!",
    });
  }
};

module.exports = {
  createPermission,
  getPermission,
  deletePermission,
  updatePermission,
};
