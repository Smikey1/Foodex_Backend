import express from "express";

import {
  AddCategory,
  deleteCategory,
  getCategory,
  UpdateCategory,
  getCategoryById,
  getSingleCategory,
} from "../controller/food_category_controller.js";
import { authenticated, authorizeRoles } from "../middleware/auth.js";
import upload from "../controller/file.js";

const router = express.Router();
router.post("/add", authenticated, AddCategory);
router.get("/get", getCategory);
router.get("/get/:id", getCategoryById);
router.get("/getSingle/:id", getSingleCategory);
router.put(
  "/update/:id",
  authenticated,
  authorizeRoles("admin"),
  upload.single("foodImage"),
  UpdateCategory
);
router.delete(
  "/category/delete/:id",
  authenticated,
  authorizeRoles("admin"),
  deleteCategory
);

export default router;
