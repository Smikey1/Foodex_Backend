import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please filled food title"],
  },
  description: {
    type: String,
  },
  price: {
    type: String,
    required: [true, "Please fill the price rate"],
  },
  foodPhoto: [
    {
      type: String,
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please select the category"],
    ref: "Food_Category",
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Food", foodSchema);
