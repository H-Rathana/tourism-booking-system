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
export const getProfile =
  async (req, res, next) => {

    try {

      const profile =
        await userService.getProfile(
          req.user.id
        );

      res.json(profile);

    } catch (error) {

      next(error);

    }

};

export const updateProfile =
  async (req, res, next) => {

    try {

      const {
        name,
        email,
        phone
      } = req.body;

      const updatedUser =
        await userService.updateProfile(
          req.user.id,
          name,
          email,
          phone
        );

      res.json(updatedUser);

    } catch (error) {

      next(error);

    }

};
export const uploadProfileImage =
  async (
    req,
    res,
    next
  ) => {

    try {

      const user =
        await userService
          .updateProfileImage(
            req.user.id,
            req.file.filename
          );

      res.json(user);

    } catch(error){

      next(error);

    }

};