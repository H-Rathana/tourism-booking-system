import * as bookingService from "../services/bookingService.js";
import { generateKHQR } from "../services/khqrService.js";


export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const booking = await bookingService.createBooking(
      userId,
      req.body
    );

    // generate KHQR
    const qrCode = generateKHQR(
      booking.total_price,
      booking.id
    );

    res.json({
      booking,
      qrCode,
    });

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

// export const approveBooking = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const booking = await bookingService.updateBookingStatus(id, "paid");

//     res.json(booking);
//   } catch (error) {
//     next(error);
//   }
// };
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

// export const rejectBooking = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const booking = await bookingService.updateBookingStatus(id, "rejected");

//     res.json(booking);
//   } catch (error) {
//     next(error);
//   }
// };
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