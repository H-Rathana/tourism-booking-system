import pool from "../config/database.js";
import * as tourService from "../services/tourService.js";
import { deleteTourService } from "../services/tourService.js";
import { updateTourService } from "../services/tourService.js";
import { getPopularTours } from "../services/tourService.js";
import { getTourStats } from "../services/tourService.js";

export const getTours = async (req, res) => {
  try {
    const tours = await tourService.getAllTours();
    res.json(tours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getTourById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM tours WHERE tour_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTour = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title,description, location, price,duration,max_people } = req.body;

    if (!title || !location || !price || !duration || !max_people) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const image = req.file.filename;

    const result = await pool.query(
      `INSERT INTO tours (title,description, location, price,duration,max_people, image)
       VALUES ($1, $2, $3, $4,$5,$6,$7)
       RETURNING *`,
      [title,description, location, price,duration,max_people, image]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("CREATE TOUR ERROR:", error); // 🔥 IMPORTANT
    res.status(500).json({ message: "Error creating tour" });
  }
};

export const updateTour = async (req, res) => {
  try {
    const { id } = req.params;

    const image = req.file ? req.file.filename : null;

    const updated = await updateTourService(id, {
      ...req.body,
      image,
    });
    
    res.json(updated);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Error updating tour" });
  }
};

export const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteTourService(id);

    res.json({ message: "Tour deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: "Error deleting tour" });
  }
};

export const getPopularToursController =
async (req,res)=>{

    const tours =
      await getPopularTours();

    res.json(tours);

};

export const getTourStatsController = async (req,res)=>{

    try{

        const stats =
            await tourService.getTourStats();

        res.json(stats);

    }catch(err){

        console.log(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

}