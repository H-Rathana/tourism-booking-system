import express from "express";
import tourRoutes from "./route/tourRoutes.js";
import { errorHandler } from "./middleware/erorrMiddleware.js";
import authRoutes from "./route/authRoutes.js";
import bookingRoutes from "./route/bookingRoutes.js";
import dashboardRoutes from "./route/dashboardRoutes.js";
import paymentRoutes from "./route/paymentRoutes.js";
import userRoutes from "./route/userRoutes.js";
import reportRoutes from "./route/reportRoutes.js";
import cors from "cors";


const app = express();
app.use(cors());
// Middleware
app.use(express.json());

// Routes
app.use("/api/tours", tourRoutes);
app.use("/api/tours/:id", tourRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments",paymentRoutes);
app.use("/api/users",userRoutes);
app.use("/api/reports",reportRoutes);
// Error handler (ALWAYS LAST)
app.use(errorHandler);

export default app;