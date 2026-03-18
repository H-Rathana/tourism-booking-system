import express from "express";
import tourRoutes from "./route/tourRoutes.js";
import { errorHandler } from "./middleware/erorrMiddleware.js";


const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/tours", tourRoutes);

// Error handler (ALWAYS LAST)
app.use(errorHandler);

export default app;