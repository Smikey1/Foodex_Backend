import express from "express";
import {
  login,
  register,
  userProfile,
  updateProfileData,
  updateProfileWithImage,
  deleteProfile,
  change_password,
  get_user_wishlist_product,
  save_product_to_wishlist,
} from "../controller/user_controller.js";
import { authenticated, authorizeRoles } from "../middleware/auth.js";
import upload from "../controller/file.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticated, userProfile);
router.put("/update/profile-data", authenticated, updateProfileData);
router.put("/update/profile-all", authenticated, updateProfileWithImage);
router.post("/change-password", authenticated, change_password);

router.delete("/delete", authenticated, deleteProfile);

// wishlist route
router.get("/wishlistProduct", authenticated, get_user_wishlist_product);
router.post(
  "/wishlistProduct/:productId",
  authenticated,
  save_product_to_wishlist
);

export default router;
