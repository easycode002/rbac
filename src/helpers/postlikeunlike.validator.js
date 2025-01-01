const { check } = require("express-validator");

const postLikeUnlikeValidator = [
  check("user_id", "user_id is required").not().isEmpty(),
  check("post_id", "post_id is required").not().isEmpty(),
];

const postLikeCountValidator = [
  check("post_id")
    .notEmpty()
    .withMessage("Post ID is required.")
    .isMongoId()
    .withMessage("Invalid Post ID format."),
];

module.exports = { postLikeCountValidator, postLikeUnlikeValidator };
