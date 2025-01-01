const PostModel = require("../models/post.model");
const { validationResult } = require("express-validator");

// Add post
const addPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    const { title, description } = req.body;

    var postObj = {
      title,
      description,
    };

    if (req.body.categories) {
      postObj.categories = req.body.categories;
    }

    const post = new PostModel(postObj);

    const dataPost = await post.save();
    console.log("Post data:::" + dataPost);

    const postFullData = await PostModel.findOne({
      _id: dataPost._id,
    }).populate("categories");
    return res.status(200).json({
      success: true,
      msg: "Post create successfuly!",
      data: postFullData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await PostModel.find({}).populate("categories");
    return res.status(200).json({
      success: true,
      msg: "Retriev post successfuly!",
      data: post,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = {
  addPost,
  getPost,
};
