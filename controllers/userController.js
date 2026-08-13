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

export const getUserById =
  async (req, res, next) => {

    try {

      const user =
        await userService.getUserById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      res.json(user);

    } catch (error) {

      next(error);

    }

};
export const promoteUser = async (req, res, next) => {
  try {

    const user = await userService.promoteUser(
      req.params.id
    );

    res.json({
      message: "User promoted successfully",
      user,
    });

  } catch (error) {

    next(error);

  }
};
export const demoteUser = async (req, res, next) => {
  try {

    const user = await userService.demoteUser(
      req.user.id,
      req.params.id
    );

    res.json({
      message: "User demoted successfully",
      user,
    });

  } catch (error) {

    next(error);

  }
};
export const deleteUser = async (req, res, next) => {

  try {

    const result =
      await userService.deleteUser(
        req.user.id,
        req.params.id
      );

    res.json(result);

  } catch (error) {

    next(error);

  }

};

export const resetUserPassword = async (req, res, next) => {
  try {

    const { password, confirmPassword } = req.body;

    // Check password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const result =
      await userService.resetUserPassword(
        req.user.id,
        req.params.id,
        password
      );

    res.json({
      message: "Password reset successfully",
      user: result,
    });

  } catch (error) {

    next(error);

  }
};

// ✅ CHANGE PASSWORD
export const changePassword = async (
  req,
  res,
  next
) => {

  try {

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    const result =
      await userService.changeUserPassword(
        req.user.id,
        currentPassword,
        newPassword,
        confirmPassword
      );

    res.json(result);

  } catch (error) {

    next(error);

  }
};

// 🔐 REQUEST PASSWORD RESET
export const requestPasswordReset = async (
  req,
  res,
  next
) => {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const result =
      await userService.requestPasswordReset(
        email
      );

    res.json({
      success: true,
      ...result,
    });

  } catch (error) {

    next(error);

  }
};
// 🔐 VERIFY PASSWORD RESET CODE
export const verifyPasswordResetCode =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        email,
        code,
      } = req.body;

      if (!email || !code) {

        return res.status(400).json({
          success: false,
          message:
            "Email and verification code are required",
        });

      }

      const result =
        await userService
          .verifyPasswordResetCode(
            email,
            code
          );

      res.json({
        success: true,
        ...result,
      });

    } catch (error) {

      next(error);

    }

  };

  // 🔐 RESET PASSWORD
export const resetPassword = async (
  req,
  res,
  next
) => {

  try {

    const {
      resetId,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !resetId ||
      !newPassword ||
      !confirmPassword
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Reset ID, new password and confirmation are required",
      });

    }

    const result =
      await userService.resetPassword(
        resetId,
        newPassword,
        confirmPassword
      );

    res.json({
      success: true,
      ...result,
    });

  } catch (error) {

    next(error);

  }
};