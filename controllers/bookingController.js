import * as bookingService
from "../services/bookingService.js";

// ✅ CREATE BOOKING
export const createBooking =
  async (req, res, next) => {

    try {

      const userId =
        req.user.id;

      const result =
        await bookingService.createBooking(
          userId,
          req.body
        );

      res.json(result);

    } catch (error) {

      next(error);

    }

};

// ✅ GET ALL BOOKINGS
export const getBookings =
  async (req, res, next) => {

    try {

      await bookingService.updateCompletedBookings();

      const bookings =
        await bookingService.getAllBookings();

      res.json(bookings);

    } catch (error) {

      next(error);

    }

};

// ✅ APPROVE BOOKING
export const approveBooking =
  async (req, res, next) => {

    try {

      const { id } =
        req.params;

      const result =
        await bookingService.updateBookingStatus(
          id,
          "approved",
          "paid"
        );

      res.json(result);

    } catch (error) {

      next(error);

    }

};

// ✅ REJECT BOOKING
export const rejectBooking =
  async (req, res, next) => {

    try {

      const { id } =
        req.params;

      const result =
        await bookingService.updateBookingStatus(
          id,
          "rejected",
          "failed"
        );

      res.json(result);

    } catch (error) {

      next(error);

    }

};
export const getTicket =
  async (
    req,
    res,
    next
  ) => {

    try {

      const ticket =
        await bookingService.getTicketById(
          req.params.id
        );

      res.json(ticket);

    } catch(error){

      next(error);

    }

};
export const checkInBooking = async (
  req,
  res,
  next
) => {

  try {

    const { id } =
      req.params;

    const booking =
      await bookingService.checkInBooking(
        id
      );

    res.json(booking);

  } catch (error) {

    next(error);

  }

};
export const getCheckedInHistory =
  async (req, res, next) => {

    try {

      const bookings =
        await bookingService.getCheckedInBookings();

      res.json(bookings);

    } catch (error) {

      next(error);

    }

};
export const getMyBookings =
  async (req, res) => {

    try {

      const bookings =
        await bookingService
          .getMyBookings(
            req.user.id
          );

      res.json(bookings);

    } catch(error){

      res.status(500).json({
        message:
          error.message
      });

    }

};