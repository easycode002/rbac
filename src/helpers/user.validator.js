const { check } = require("express-validator");

exports.userAddValidator = [
  check("name", "User name is required").not().isEmpty(),
  check("email", "Email is required").not().isEmpty(),
];


exports.userUpdateValidator = [
  check("id", "User Id is required").not().isEmpty(),
  check("name", "Name is required").not().isEmpty(),
];

exports.userDeleteValidator = [
  check("id", "User Id is required").not().isEmpty(),
];
