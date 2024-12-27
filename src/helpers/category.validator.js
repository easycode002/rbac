const { check } = require("express-validator");

exports.categoryAddValidator = [
  check("category_name", "Category name is required").not().isEmpty(),
];

exports.categoryDeleteValidator = [
  check("id", "Category Id is required").not().isEmpty(),
];

exports.categoryUpdateValidator = [
  check("id", "Category Id is required").not().isEmpty(),
  check("category_name", "Category name is required").not().isEmpty(),
];
