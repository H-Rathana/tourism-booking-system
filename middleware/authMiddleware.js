import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET;

export const protect = (
  req,
  res,
  next
) => {

  try {

    let token;

    // ✅ GET TOKEN
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {

      token =
        req.headers.authorization.split(
          " "
        )[1];

    }

    // ❌ NO TOKEN
    if (!token) {

      return res.status(401).json({
        message:
          "Not authorized, no token",
      });

    }

    // ✅ VERIFY TOKEN
    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    req.user = decoded;

    next();

  } catch (error) {

    // 🔥 JWT EXPIRED
    if (
      error.name ===
      "TokenExpiredError"
    ) {

      return res.status(401).json({
        message:
          "Session expired. Please login again.",
      });

    }

    return res.status(401).json({
      message:
        "Invalid token",
    });

  }

};