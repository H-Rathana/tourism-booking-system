import express from "express";

import {
  getUsers,
  getProfile,
  updateProfile,
  uploadProfileImage,
  getUserById,
} from "../controllers/userController.js";
import {
  protect
}
from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import { isAdmin } from "../middleware/roleMiddleware.js";

const router =
  express.Router();

// ✅ GET USERS
router.get("/",getUsers);

router.get("/profile",protect,getProfile);

router.put("/profile",protect,updateProfile);

router.post("/profile/image",protect,upload.single("profile_image"),uploadProfileImage);

router.get("/:id",protect,isAdmin,getUserById);

export default router;