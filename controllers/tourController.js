
import * as tourService from "../services/tourService.js";
import {updateSingleTourStatus, getTourByIdService,} from "../services/tourService.js";
import { deleteTourService } from "../services/tourService.js";
import { updateTourService } from "../services/tourService.js";
import { getPopularTours } from "../services/tourService.js";
import { getTourStats } from "../services/tourService.js";
import { getAvailableTours } from "../services/tourService.js";
import {getPopularDestinations,} from "../services/tourService.js";
import {getDestinationsService,} from "../services/tourService.js";
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

    const tour = await tourService.getTourByIdService(id);

    if (!tour) {
      return res.status(404).json({
        message: "Tour not found",
      });
    }

    res.json(tour);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

export const getAvailableToursController = async (
  req,
  res
) => {

  try {

    const tours =
      await tourService.getAvailableTours();

    res.json(tours);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

export const createTour = async (req, res) => {
  try {

    const {
      title,
      description,
      itinerary,
      location,
      price,
      duration,
      max_people,
      available_from,
      available_until,
    } = req.body;

    if (
      !title ||
      !location ||
      !price ||
      !duration ||
      !max_people ||
      !available_from ||
      !available_until
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required.",
      });
    }

    const image = req.file.filename;

    const tour = await tourService.createTourService({
  title,
  description,
  itinerary,
  location,
  price,
  duration,
  max_people,
  available_from,
  available_until,
  image,
});

// Automatically calculate the correct status
await tourService.updateSingleTourStatus(tour.tour_id);

// Return the updated tour
const newTour =
  await tourService.getTourByIdService(tour.tour_id);

res.status(201).json(newTour);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error creating tour.",
    });

  }
};

export const updateTour = async (req, res) => {

  try {

    const { id } = req.params;

    const image =
      req.file ? req.file.filename : null;

    // Update tour information
    await updateTourService(id, {
      ...req.body,
      image,
    });

    // Recalculate the status
    await updateSingleTourStatus(id);

    // Get the latest data
    const updatedTour =
      await getTourByIdService(id);

    res.json(updatedTour);

  } catch (error) {

    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      message: "Error updating tour",
    });

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

export const getPopularDestinationsController =
  async (req, res) => {

    try {

      const destinations =
        await getPopularDestinations();

      res.json(destinations);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }

};

export const getDestinationsController = async (req, res) => {

  try {

    const destinations =
      await getDestinationsService();

    res.json(destinations);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};