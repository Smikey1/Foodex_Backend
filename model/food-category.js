import mongoose from "mongoose";

const foodCategorySchema = new mongoose.Schema({
  foodCategoryTitle: {
    type: String,
    required: [true, "Please filled food category title"],
  },
  foodCategoryImageUrl: {
    type: String,
  },
  food: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },
  ],
  foodCategoryCreateAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Food_Category", foodCategorySchema);
