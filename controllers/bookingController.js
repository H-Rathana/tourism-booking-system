import * as bookingService from "../services/bookingService.js";

export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log("REQ.USER:", req.user);
    const booking = await bookingService.createBooking(userId, req.body);
    
    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const approveBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await bookingService.updateBookingStatus(id, "approved");

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const rejectBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await bookingService.updateBookingStatus(id, "rejected");

    res.json(booking);
  } catch (error) {
    next(error);
  }
};