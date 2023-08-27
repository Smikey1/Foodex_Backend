import Cart from "../model/Cart.js";

export const add_new_cart = async function (req, res) {
  try {
    const foodId = req.params.id;
    const userId = req.user._id;
    const quantity = req.params.quantity;
    console.log(userId);
    const inCart = await Cart.findOne({ foodId, userId });
    if (inCart) {
      await Cart.updateOne(
        { foodId: foodId, userId },
        { quantity: req.params.quantity }
      );
      let updatedCart = await Cart.findOne({ foodId, userId });
      res.status(200).json({
        success: true,
        message: "Cart Quantity Updated Successfully!",
        data: updatedCart,
      });
    } else {
      const cart = new Cart({
        foodId,
        userId,
        quantity,
      });
      const saved = await cart.save();
      res.status(201).json({
        success: true,
        message: "Item added cart!",
        data: saved,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}; // add cart

export const update_cart = async function (req, res) {
  try {
    const foodId = req.params.id;
    const userId = req.user._id;
    let updatedcart = await Cart.updateOne(
      { foodId: foodId, userId },
      { quantity: req.params.quantity },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Quantity Updated Succesfully!",
      // async and await ma return garne tarika
      data: updatedcart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}; //update cart

export const delete_cart = async function (req, res) {
  try {
    const foodId = req.params.id;
    const userId = req.user._id;
    const response = await Cart.deleteOne({ foodId: foodId, userId });
    if (response.deletedCount > 0) {
      res.status(201).json({
        success: true,
        message: "Item Deleted Succesfully!",
      });
    } else {
      res.status(201).json({
        success: false,
        message: "This item is not in cart!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
}; // delete cart

export const get_all_cart = async function (req, res) {
  try {
    // userko id auth bata aaune
    const userId = req.user._id;
    const cartsData = await Cart.find({ userId }).populate("foodId");
    res.status(200).json({
      success: true,
      message: "Cart get success!",
      data: cartsData,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
}; // fetch all cart
