const { Payment_Methods, sequelize } = require("../models");
const { constants: http } = require("http2");
const { QueryTypes } = require("sequelize");

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

exports.getSalesData = async (req, res) => {
  const role = req.role;
  if (role !== "admin") {
    return res.status(http.HTTP_STATUS_FORBIDDEN).json({
      success: false,
      message: "Forbidden",
    });
  }

  try {
    const result = await sequelize.query(`
      SELECT 
        m.id AS id_movie,
        m.title,
        COUNT(td.seat) AS tickets_sold,
        m.price AS price_per_ticket,
        COUNT(td.seat) * m.price AS total_amount
      FROM transactions_detail td
      JOIN showtimes s ON s.id = td.id_showtime
      JOIN movies m ON m.id = s.id_movie
      GROUP BY m.id, m.title, m.price
    `, { type: QueryTypes.SELECT });
    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success to get sales data",
      result,
    });
  } catch(err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};