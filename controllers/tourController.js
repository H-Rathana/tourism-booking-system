import pool from "../config/database.js";
import * as tourService from "../services/tourService.js";

export const getTours = async (req, res) => {
  try {
    const tours = await tourService.getAllTours();
    res.json(tours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTour = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, location, price } = req.body;

    if (!title || !location || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const image = req.file.filename;

    const result = await pool.query(
      `INSERT INTO tours (title, location, price, image)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, location, price, image]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("CREATE TOUR ERROR:", error); // 🔥 IMPORTANT
    res.status(500).json({ message: "Error creating tour" });
  }
};
export const updateTour = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedTour = await tourService.updateTour(id, req.body);

    if (!updatedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.json(updatedTour);
  } catch (error) {
    next(error);
  }
};

export const deleteTour = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTour = await tourService.deleteTour(id);

    if (!deletedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.json({ message: "Tour deleted successfully" });
  } catch (error) {
    next(error);
  }
};
