const { Payment_Methods } = require("../models");
const { constants: http } = require("http2");

exports.addPaymentMethod = async (req, res) => {
  try {
    const role = req.role;
    if (role !== "admin") {
      return res.status(http.HTTP_STATUS_FORBIDDEN).json({
        success: false,
        message: "Forbidden",
      });
    }

    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Payment method name should not be empty",
      });
    }

    await Payment_Methods.create({ name });
    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Payment method successfully been added",
    });
  } catch(err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Status internal server error",
    });
  }
};