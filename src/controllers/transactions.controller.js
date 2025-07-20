const { Payment_Methods, Showtimes, Transaction_Detail, Movie, Transactions, sequelize } = require("../models");
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

exports.addTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  const userId = req.userId;

  try {
    const {
      movieId,
      paymentMethodId,
      location,
      cinema,
      date,
      showtime,
      seats
    } = req.body;

    if (!movieId || !paymentMethodId || !location || !cinema || !date || !showtime || !seats || !seats.length) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Failed to order ticket",
        errors: "transactions data should not be empty"
      });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Failed to order ticket",
        errors: "invalid date format, use YYYY-MM-DD"
      });
    }

    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(showtime)) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Failed to order ticket",
        errors: "invalid showtime format, use HH:MM:SS"
      });
    }

    let showtimeData = await Showtimes.findOne({
      where: {
        id_movie: movieId,
        location,
        cinema,
        date,
        showtime
      },
      transaction: t
    });

    if (!showtimeData) {
      showtimeData = await Showtimes.create({
        id_movie: movieId,
        location,
        cinema,
        date,
        showtime
      }, { transaction: t });
    }

    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Failed to order ticket",
        errors: "Movie not found"
      });
    }

    const price = movie.price;
    const totalAmount = price * seats.length;

    const transaction = await Transactions.create({
      id_user: userId,
      id_payment_method: paymentMethodId,
      total_price: totalAmount
    }, { transaction: t });

    const trxDetailPayload = seats.map(seat => ({
      id_transaction: transaction.id,
      id_showtime: showtimeData.id,
      seat
    }));
    await Transaction_Detail.bulkCreate(trxDetailPayload, { transaction: t });

    await t.commit();
    return res.status(201).json({
      success: true,
      message: "Success to order ticket",
      result: {
        showtimeId: showtimeData.id,
        transactionId: transaction.id
      }
    });
  } catch(err) {
    await t.rollback();
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Failed to order ticket",
        errors: "Seat(s) are already taken"
      });
    }
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error"
    });
  }
};