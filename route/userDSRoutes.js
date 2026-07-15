import express from "express";

import {
  getHomeStats
} from "../controllers/userDSController.js";

const router = express.Router();

router.get(
  "/home-stats",
  getHomeStats
);

export default router;