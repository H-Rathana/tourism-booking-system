import {
  getHomeStatsService,
} from "../services/userDS.js";

export const getHomeStats = async (
  req,
  res
) => {

  try {

    const stats =
      await getHomeStatsService();

    res.status(200).json(stats);

  } catch (error) {

    console.error(error);

    res.status(500).json({

      message:
        "Failed to load homepage statistics.",

    });

  }

};