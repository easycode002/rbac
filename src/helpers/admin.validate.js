const { check } = require("express-validator");

exports.permissionValidatoor = [
  check("permission_name", "Permission name is required").not().isEmpty(),
];