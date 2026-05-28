import * as paymentService
from "../services/paymentService.js";

// ✅ GET PAYMENTS
export const getPayments =
  async (req, res, next) => {

    try {

      const payments =
        await paymentService.getAllPayments();

      res.json(payments);

    } catch (error) {

      next(error);

    }

};