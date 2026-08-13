import express from "express";

import {
  getUsers,
  getProfile,
  updateProfile,
  uploadProfileImage,
  getUserById,
  promoteUser,
  demoteUser,
  deleteUser,
  resetUserPassword,
  changePassword,
  requestPasswordReset,
  verifyPasswordResetCode,
  resetPassword,
} from "../controllers/userController.js";
import {
  protect
}
from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

// import { isAdmin } from "../middleware/roleMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router =
  express.Router();

// ✅ GET USERS
router.get("/",getUsers);

router.get("/profile",protect,getProfile);

router.put("/profile",protect,updateProfile);

router.patch("/change-password",protect,changePassword);

router.post("/forgot-password",requestPasswordReset);

router.post("/verify-reset-code",verifyPasswordResetCode);

router.post("/reset-password",resetPassword);

router.post("/profile/image",protect,upload.single("profile_image"),uploadProfileImage);

router.get("/:id",protect,authorize("admin", "SUPER_ADMIN"),getUserById);

router.patch( "/:id/promote",protect, authorize("SUPER_ADMIN"),promoteUser);

router.patch("/:id/demote", protect,authorize("SUPER_ADMIN"),demoteUser);

router.delete("/:id",protect,authorize("SUPER_ADMIN"), deleteUser);

router.patch("/:id/reset-password", protect,authorize("SUPER_ADMIN"), resetUserPassword); 



export default router;