import Order from "../model/order.js";
import Cart from "../model/Cart.js";

export const add_new_order = async function (req, res) {
  try {
    const userId = req.user._id;
    console.log("url hits");
    console.log(userId);
    const cartsData = await Cart.find({ userId }).populate("foodId");
    cartsData.forEach(async (cart) => {
      const order = new Order({
        foodId: cart.foodId._id,
        userId: cart.userId,
        orderedQty: cart.quantity,
        totalPrice: cart.foodId.price * cart.quantity,
      });
      await order.save();
    });
    res.status(200).json({
      success: true,
      message: "Order Placed Successfully!",
    });
    await Cart.deleteMany({ userId });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}; // add order

export const update_order = async function (req, res) {
  try {
    const orderId = req.params.orderId;
    let updatedOrder = await Order.updateOne(
      { _id: orderId },
      {
        deliveryStatusMessage: req.params.deliveryStatusMessage,
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Order Updated Successfully!",
      // async and await ma return garne tarika
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; //update order

export const delete_order = async function (req, res) {
  try {
    const orderId = req.params.id;
    const response = await Order.deleteOne({ _id: orderId });
    if (response.deletedCount > 0) {
      res.status(201).json({
        success: true,
        message: "Item Deleted Successfully!",
      });
    } else {
      res.status(201).json({
        success: false,
        message: "This item is not ordered!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
}; // delete order

export const get_all_order = async function (req, res) {
  try {
    const userId = req.user.id;
    const ordersData = await Order.find({
      userId: userId,
      deliveryStatusMessage: req.params.status,
    }).populate("userId foodId");
    res.status(200).json({
      success: true,
      data: ordersData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
}; // fetch all order

export const get_order_by_id = async function (req, res) {
  const id = req.params.id;
  try {
    const singleOrderData = await Order.findOne({ _id: id }).populate(
      "userId foodId"
    );
    res.status(200).json({
      success: true,
      singleOrderData: singleOrderData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
}; // get order by id
