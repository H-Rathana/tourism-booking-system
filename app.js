import express from "express";
import tourRoutes from "./route/tourRoutes.js";
import { errorHandler } from "./middleware/erorrMiddleware.js";
import authRoutes from "./route/authRoutes.js";
import bookingRoutes from "./route/bookingRoutes.js";
import cors from "cors";

const app = express();
app.use(cors());
// Middleware
app.use(express.json());

// Routes
app.use("/api/tours", tourRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/uploads", express.static("uploads"));
// Error handler (ALWAYS LAST)
app.use(errorHandler);

export default app;