import express from "express";

import {
  getUsers,
  getProfile,
  updateProfile,
  uploadProfileImage
} from "../controllers/userController.js";
import {
  protect
}
from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router =
  express.Router();

// ✅ GET USERS
router.get(
  "/",
  getUsers
);
router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);
router.post(
  "/profile/image",
  protect,
  upload.single(
    "profile_image"
  ),
  uploadProfileImage
);

export default router;