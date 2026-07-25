import * as reportServiceV2
from "../services/reportServiceV2.js";

export const getReportData = async (
  req,
  res,
  next
) => {

  try {

    const {
      type = "month",
      date = new Date().toISOString().split("T")[0],
    } = req.query;

    const data =
      await reportServiceV2.getReportDataV2(
        type,
        date
      );

    res.json(data);

  } catch (error) {

    next(error);

  }

};