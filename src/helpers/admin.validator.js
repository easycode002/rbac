const { check } = require("express-validator");

exports.permissionAddValidator = [
  check("permission_name", "Permission name is required").not().isEmpty(),
];

exports.permissionDeleteValidator = [
  check("id", "Permission Id is required").not().isEmpty(),
];

exports.permissionUpdateValidator = [
  check("id", "Permission Id is required").not().isEmpty(),
  check("permission_name", "Permission name is required").not().isEmpty(),
];

exports.roleAddValidator = [
  check("role_name", "Role name is required").not().isEmpty(),
  check("value", "Role value is required").not().isEmpty(),
];