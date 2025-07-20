const { Payment_Methods } = require("../models");
const { constants: http } = require("http2");

exports.getPaymentMethods = async (req, res) => {
  try {
    const methods = await Payment_Methods.findAll({
      attributes: ["id", "name"],
    });

    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success to get data",
      result: methods,
    });
  } catch(err) {
    console.error(err);
    res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to get data",
    });
  }
};