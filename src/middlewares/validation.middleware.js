const { validationResult } = require("express-validator");
const {constants: http} = require("http2");

exports.handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors: messages
    });
  }
  next();
};
