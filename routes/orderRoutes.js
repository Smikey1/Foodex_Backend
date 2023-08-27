import express from "express";

import {
  add_new_order,
  update_order,
  delete_order,
  get_all_order,
  get_order_by_id,
} from "../controller/orderController.js";
import { authenticated, authorizeRoles } from "../middleware/auth.js";

// bulk export of routes
const router = new express.Router();

//to insert order
router.post("/insert", authenticated, add_new_order); // post method

// to update order
router.put(
  "/update/:orderId/:deliveryStatusMessage",
  authenticated,
  update_order
); //put method

// to delete order
router.delete("/delete/:id", authenticated, delete_order); //delete method

// to get order by id
router.get("/getById/:id", authenticated, get_order_by_id); // get method

// to get all order
router.get("/get/:status", authenticated, get_all_order); // get method

//exporting router
export default router;
