import express from "express";
import { createTour, getTours } from "../controllers/tourController.js";
import { updateTour } from "../controllers/tourController.js";
import { deleteTour } from "../controllers/tourController.js";
const router = express.Router();


router.get("/", getTours);
router.post("/", createTour);
router.put("/:id", updateTour);
router.delete("/:id", deleteTour);
export default router;


