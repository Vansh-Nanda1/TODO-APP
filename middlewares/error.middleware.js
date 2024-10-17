const { ErrorHandler } = require("../utils/Errorhandler");

exports.error = (err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "invalid mongodb id",
      error: err.message,
    });
  }
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
    err: new ErrorHandler(err.statusCode, err.message),
    err: err,
  });
};
