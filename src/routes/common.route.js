const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const {
  categoryAddValidator,
  categoryDeleteValidator,
  categoryUpdateValidator,
} = require("../helpers/category.validator");
const {
  postLikeUnlikeValidator,
  postLikeCountValidator,
} = require("../helpers/postlikeunlike.validator");
const { postAddValidator } = require("../helpers/post.validator");
const {
  userAddValidator,
  userUpdateValidator,
  userDeleteValidator,
} = require("../helpers/user.validator");

const categoryController = require("../controllers/category.controller");
const postController = require("../controllers/post.category");
const userController = require("../controllers/user.controller");
const likeController = require("../controllers/like.controller");

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

// Posts routes
router.post("/post", auth, postAddValidator, postController.addPost);
router.get("/post", auth, postController.getPost);

// User routes
router.post("/user", auth, userAddValidator, userController.addUser);
router.get("/user", auth, userController.getUser);
router.put("/user", auth, userUpdateValidator, userController.updateUser);
router.delete("/user", auth, userDeleteValidator, userController.deleteUser);

// Post like routes
router.post(
  "/post-like",
  auth,
  postLikeUnlikeValidator,
  likeController.postLike
);
router.delete(
  "/post-unlike",
  auth,
  postLikeUnlikeValidator,
  likeController.postUnLike
);
router.get(
  "/post-like-count",
  auth,
  postLikeCountValidator,
  likeController.postLikeCount
);

// postLikeUnlikeValidator
module.exports = router;
