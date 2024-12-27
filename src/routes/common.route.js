const express = require("express");
const router = express();
const auth = require("../middlewares/auth.middleware");

const {
  categoryAddValidator,
  categoryDeleteValidator,
  categoryUpdateValidator,
} = require("../helpers/category.validator");
const categoryController = require("../controllers/category.controller");

// Category routes
router.post(
  "/category",
  auth,
  categoryAddValidator,
  categoryController.createCategory
);
router.get("/categories", auth, categoryController.getCategory);
router.delete(
  "/categories",
  auth,
  categoryDeleteValidator,
  categoryController.deleteCategory
);
router.put(
  "/categories",
  auth,
  categoryUpdateValidator,
  categoryController.updateCategory
);

module.exports = router;
