import * as authService from "../services/authService.js";


export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await authService.loginUser(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};