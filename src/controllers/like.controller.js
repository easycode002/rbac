const { validationResult } = require("express-validator");
const LikeModel = require("../models/like.model");

const postLike = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    // Only request with body
    const { user_id, post_id } = req.body;
    const isLiked = await LikeModel.findOne({ user_id, post_id });

    if (isLiked) {
      return res.status(400).json({
        success: false,
        msg: "Already liked!",
      });
    }

    const like = new LikeModel({ user_id, post_id });
    const likeData = await like.save();
    return res.status(200).json({
      success: true,
      msg: "Post liked!",
      data: likeData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const postUnLike = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    // Only request with body
    const { user_id, post_id } = req.body;
    const isLiked = await LikeModel.findOne({ user_id, post_id });

    if (!isLiked) {
      return res.status(400).json({
        success: false,
        msg: "You have not like!",
      });
    }

    await LikeModel.deleteOne({
      user_id,
      post_id,
    });

    return res.status(200).json({
      success: true,
      msg: "Post liked!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

// const postLikeCount = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty) {
//       return res.status(200).json({
//         success: false,
//         msg: "Error",
//         errors: errors.array(),
//       });
//     }

//     // Only request with body
//     const { post_id } = req.body;
//     const likeCount = await LikeModel.find({ post_id }).countDocuments();

//     if (likeCount === 0) {
//       return res.status(200).json({
//         success: true,
//         msg: "No likes for this post!",
//         count: likeCount,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       msg: "Post like count retrieved successfully!",
//       count: likeCount,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       msg: "Internal server error",
//       error: error.message,
//     });
//   }
// };

const mongoose = require("mongoose");

const postLikeCount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation error",
        errors: errors.array(),
      });
    }

    const { post_id } = req.body;

    // Convert post_id to ObjectId correctly
    const postId = new mongoose.Types.ObjectId(post_id);

    // Count likes for the given post_id
    const likeCount = await LikeModel.find({ post_id: postId }).countDocuments();

    return res.status(200).json({
      success: true,
      msg: "Post like count retrieved successfully!",
      count: likeCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
};


module.exports = {
  postLike,
  postUnLike,
  postLikeCount,
};
