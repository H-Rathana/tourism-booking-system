export const errorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || 500;

  // Only print stack for real server errors
  if (statusCode >= 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal Server Error"
        : err.message,
  });

};