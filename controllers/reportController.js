import * as reportService from "../services/reportService.js";

export const getReportData = async (
  req,
  res,
  next
) => {
  try {

    const data =
      await reportService.getReportData();

    res.json(data);

  } catch (error) {

    next(error);

  }
};