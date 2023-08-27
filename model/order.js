import mongoose from "mongoose";

// creating tables for order
const orderSchema = new mongoose.Schema({
  deliveryStatusMessage: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled"],
    default: "Pending",
  },
  orderedDate: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
  },

  totalPrice: {
    type: Number,
  },

  orderedQty: {
    type: Number,
  },


});
// exporting order from db
export default mongoose.model("Order", orderSchema);
