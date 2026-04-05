import express from "express";
import { createTour, getTours } from "../controllers/tourController.js";
import { updateTour } from "../controllers/tourController.js";
import { deleteTour } from "../controllers/tourController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { upload } from "../utils/uploads.js";
const router = express.Router();


// Only admin can create/update/delete
//router.post("/", protect, isAdmin, createTour);
router.post("/", protect, isAdmin, upload.single("image"), createTour);
router.put("/:id", protect, isAdmin, updateTour);
router.delete("/:id", protect, isAdmin, deleteTour);

// Everyone can view
router.get("/", getTours);


export default router;


