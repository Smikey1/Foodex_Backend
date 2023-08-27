import mongoose from "mongoose";

// creating tables for cart
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

// exporting customer from db
export default mongoose.model("Cart", cartSchema);
