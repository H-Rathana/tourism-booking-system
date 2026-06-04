import * as notificationService
from "../services/notificationService.js";

export const getNotifications =
  async (req,res,next) => {

    try {

      const notifications =
        await notificationService
          .getUserNotifications(
            req.user.id
          );

      res.json(
        notifications
      );

    } catch(error){

      next(error);

    }

};

export const readNotification =
  async (req,res,next) => {

    try {

      await notificationService
        .markAsRead(
          req.params.id
        );

      res.json({
        success:true
      });

    } catch(error){

      next(error);

    }

};