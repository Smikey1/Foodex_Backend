import express from "express";
import {
  login,
  register,
  userProfile,
  updateProfile,
  deleteProfile,
  update_profile_picture,
} from "../controller/user_controller.js";
import { authenticated, authorizeRoles } from "../middleware/auth.js";
import upload from "../controller/file.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticated, userProfile);
router.put(
  "/update/profile",
  authenticated,
  upload.single("avatar"),
  updateProfile
);

router.put("/profile-picture", authenticated, update_profile_picture);

router.delete(
  "/user/delete/:id",
  authenticated,
  authorizeRoles("admin"),
  deleteProfile
);

export default router;
