import Food_Category from "../model/food-category.js";
import { upload_image } from "../middleware/cloudinary.js";

// Add new Category
export const AddCategory = async (req, res) => {
  const formImage = req.files.foodImage;
  const imagePath = formImage.tempFilePath;
  const _id = req.user._id;

  if (formImage) {
    try {
      const foodImage = await upload_image(imagePath, _id);

      const { title } = req.body;
      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Filled can't be empty!",
        });
      }

      const exist = await Food_Category.findOne({ foodCategoryTitle: title });
      if (exist) {
        return res.status(400).json({
          success: false,
          message: "Name must be different!",
        });
      }

      const foodCategory = await Food_Category.create({
        foodCategoryTitle: title,
        foodCategoryImageUrl: foodImage,
      });

      const foodDetails = {
        id: foodCategory._id,
        title: foodCategory.foodCategoryTitle,
        foodImage: foodImage,
      };

      res.status(200).json({
        success: true,
        message: "Food Category added Successfully!",
        data: foodDetails,
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

// Get All Category
export const getCategory = async (req, res) => {
  try {
    const food_Category = await Food_Category.find({}).sort({ _id: -1 });
    console.log(food_Category);
    console.log(food_Category.food);

    if (!food_Category) {
      return res.status(400).json({
        success: false,
        message: "Not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Category Fetched successfully!",
      data: food_Category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 


export const getFoodCategory = async (req, res) => {
    try {
      let Categories = await Food_Category.find({
        foodCategoryTitle: req.body.foodCategoryTitle,
      }).sort({ _id: -1 });
      if (Categories) {
        return res.status(200).json({
          success: true,
          message: "Category Fetched Successfully",
          data: Categories
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

// Get category by ID
// export const getCategoryById = async (req, res) => {
//   try {
//     const food_Category = await Food_Category.findById(req.params.id).populate({
//       path: "food",
//       model: "Food",
//       select: "title",
//     });
//     if (!food_Category) {
//       return res.status(400).json({
//         success: false,
//         message: "Not found!",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Category Fetched successfully!",
//       data: food_Category,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export const getSingleCategory = async (req, res) => {
  try {
    const food_Category = await Food_Category.findOne({
      _id: req.params.id,
    }).sort({ _id: -1 });
    if (!food_Category) {
      return res.status(400).json({
        success: false,
        message: "Category Not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Food category get success!",
      data: food_Category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Food Category by ID
export const UpdateCategory = async (req, res) => {
  try {
    const { title } = req.body;
    const foodImage = req.file.filename;

    const exist = await Food_Category.findById(req.params.id);
    if (!exist) {
      return res.status(400).json({
        success: false,
        message: "category id does not exist",
      });
    }

    const food = await Food_Category.findByIdAndUpdate(
      req.params.id,
      { title, foodImage: foodImage },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
      success: true,
      message: "Food Category updated Successfully",
      data: food,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete category by ID

export const deleteCategory = async (req, res) => {
  try {
    let foodCat = await Food_Category.findById(req.params.id);
    if (!foodCat) {
      return res.status(400).json({
        success: false,
        message: "Food Category is not found!",
      });
    }

    await foodCat.remove();

    res.status(200).json({
      success: true,
      message: "Food category is remove successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
