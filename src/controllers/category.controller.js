const CategoryModel = require("../models/categories.model");
const { validationResult } = require("express-validator");

const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    const { category_name } = req.body;
    const isExistCategory = await CategoryModel.findOne({
      name: {
        $regex: category_name,
        $options: "i",
      },
    });

    if (isExistCategory) {
      return res.status(400).json({
        success: false,
        msg: "Category name already exist!",
      });
    }

    const category = new CategoryModel({
      name: category_name,
    });
    const categoryData = await category.save();

    return res.status(200).json({
      success: true,
      msg: "Create category successfull!",
      data: categoryData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const getCategory = async (_req, res) => {
  try {
    const category = await CategoryModel.find({});
    return res.status(200).json({
      success: true,
      msg: "Retriev category successfull!",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
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

    const isExistCategory = await CategoryModel.findOne({ _id: id });
    if (!isExistCategory) {
      return res.status(404).json({
        success: false,
        msg: "Category Id not found!",
      });
    }

    await CategoryModel.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      msg: "Category delete successfully!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(200).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }

    const { id, category_name } = req.body;
    const categories = await CategoryModel.findOne({ _id: id });
    if (!categories) {
      return res.status(400).json({
        success: false,
        msg: "Category Id not found!",
      });
    }

    const cagetoryData = await CategoryModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name: category_name,
        },
      },
      { new: true }
    );
    return res.status(400).json({
      success: true,
      msg: "Category update successfully!",
      data: cagetoryData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "Category Id not found!",
    });
  }
};
module.exports = {
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
};
