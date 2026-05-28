import * as userService
from "../services/userService.js";

// ✅ GET USERS
export const getUsers =
  async (req, res, next) => {

    try {

      const users =
        await userService.getAllUsers();

      res.json(users);

    } catch (error) {

      next(error);

    }

};