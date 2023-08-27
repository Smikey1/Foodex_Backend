import express from "express";

import {
  add_new_cart,
  update_cart,
  delete_cart,
  get_all_cart,
} from "../controller/cartController.js";

import { authenticated, authorizeRoles } from "../middleware/auth.js";

// bulk export of routes
const router = express.Router();

//to insert cart
router.post("/insert/:id/:quantity", authenticated, add_new_cart); // post method

// to update cart
router.put("/update/:id/:quantity", authenticated, update_cart); //put method

// to delete cart
router.delete("/delete/:id", authenticated, delete_cart); //delete method

// to get all cart
router.get("/get", authenticated, get_all_cart); // get method

//exporting router
export default router;
