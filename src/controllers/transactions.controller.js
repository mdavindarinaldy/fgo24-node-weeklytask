const { Payment_Methods, Showtimes, Transaction_Detail } = require("../models");
const { constants: http } = require("http2");
const { Sequelize } = require("sequelize");

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

exports.getReservedSeats = async (req, res) => {
  try {
    const { id_movie, cinema, location, date, showtime } = req.query;
    if (!id_movie || !cinema || !location || !date || !showtime) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Failed to get data reserved seats",
        errors: "All fields must be provided",
      });
    }

    const showtimeData = await Showtimes.findOne({
      where: {
        id_movie,
        cinema,
        location,
        date,
        showtime,
      },
    });

    if (!showtimeData) {
      return res.status(http.HTTP_STATUS_OK).json({
        success: true,
        message: "Success to get data reserved seats",
        result: {
          id_showtime: 0,
          seats: "",
        },
      });
    }

    const showtimeId = showtimeData.id;
    const result = await Transaction_Detail.findAll({
      attributes: [
        "id_showtime",
        [Sequelize.fn("STRING_AGG", Sequelize.col("seat"), ", "), "seats"],
      ],
      where: { id_showtime: showtimeId },
      group: ["id_showtime"],
      raw: true,
    });
    if (result.length === 0) {
      return res.status(http.HTTP_STATUS_OK).json({
        success: true,
        message: "Success to get data reserved seats",
        result: {
          id_showtime: showtimeId,
          seats: "",
        },
      });
    }

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success to get data reserved seats",
      result: {
        id_showtime: result[0].id_showtime,
        seats: result[0].seats,
      },
    });
  } catch(err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to get data reserved seats",
      errors: err.message,
    });
  }
};