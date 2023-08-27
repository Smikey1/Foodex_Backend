import Food from "../model/food.js";
import User from "../model/user.js";
import { upload_image } from "../middleware/cloudinary.js";

// Add Food item
export const addFood = async (req, res) => {
  const formImage = req.files.foodPhoto;
  const imagePath = formImage.tempFilePath;
  const _id = req.user._id;
  const { category: categoryId } = req.body;
  console.log(categoryId);
  if (formImage) {
    try {
      const foodImage = await upload_image(imagePath, _id);

      const { title, description, price, category } = req.body;

      if (!title || !description || !price || !category) {
        return res.status(400).json({
          success: false,
          message: "Field can't be empty",
        });
      }

      const exist = await Food.findOne({ title });
      if (exist) {
        return res.status(400).json({
          success: false,
          message: "Food name already exist",
        });
      }

      const food = await Food.create({
        title,
        description,
        price,
        category,
        foodPhoto: [foodImage],
      });
      res.status(200).json({
        success: true,
        message: "food created successfully!",
        data: food,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    return res.status(500).json({
      success: false,
      message: "Food Image is required",
    });
  }
};

// Get all Food
export const getAllFood = async (req, res) => {
  try {
    const food = await Food.find().populate("category");
    if (!food) {
      return res.status(400).json({
        success: false,
        message: "Not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "food get success!",
      data: food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all Categorized Food
export const getAllCategorizedFood = async (req, res) => {
  try {
    const food = await Food.find({
      category: req.params.categoryId,
    }).populate("category");
    if (!food) {
      return res.status(400).json({
        success: false,
        message: "Not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "food get success!",
      data: food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Food
export const getSingleFood = async (req, res) => {
  try {
    const food = await Food.findOne({ _id: req.params.foodId }).populate({
      path: "category",
      model: "Food_Category",
      select: "title",
    });
    if (!food) {
      return res.status(400).json({
        success: false,
        message: "Not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "food get success!",
      data: food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
