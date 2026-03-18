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
    const newTour = await tourService.createTour(req.body);
    res.json(newTour);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
