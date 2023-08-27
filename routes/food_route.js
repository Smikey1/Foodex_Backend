import express from "express";

import {
  addFood,
  getAllFood,
  getAllCategorizedFood,
  getSingleFood,
} from "../controller/food_controller.js";
import { authenticated } from "../middleware/auth.js";
import upload from "../controller/file.js";

const router = express.Router();

router.get("/:foodId", getSingleFood);
router.get("/category/:categoryId", getAllCategorizedFood);
router.get("/", getAllFood);
router.post("/", authenticated, addFood);
// router.get("/getSingle/:id", getSingleFood);

// router.post("/uploadImage", uploadImage);

export default router;
