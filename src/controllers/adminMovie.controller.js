const {constants: http} = require("http2");
const {Director, Cast} = require("../models");
const {Op} = require("sequelize");

exports.addDirector = async function (req, res) {
  try {
    if (req.role !== "admin") {
      return res.status(http.HTTP_STATUS_FORBIDDEN).json({
        success: false,
        message: "Forbidden",
      });
    }

    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Director name should not be empty",
      });
    }

    const newDirector = await Director.create({ name });
    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Success to add new director",
      result: {
        id: newDirector.id,
        name: newDirector.name,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getDirector =  async function (req, res) {
  try {
    if (req.role !== "admin") {
      return res.status(http.HTTP_STATUS_FORBIDDEN).json({
        success: false,
        message: "Forbidden",
      });
    }

    const search = req.query.search || "";
    const directors = await Director.findAll({
      where: {
        name: {
          [Op.iLike]: `%${search}%`,
        },
      },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success to get directors list",
      result: directors,
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.addCast = async function (req, res) {
  try {
    if (req.role !== "admin") {
      return res.status(http.HTTP_STATUS_FORBIDDEN).json({
        success: false,
        message: "Forbidden",
      });
    }

    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Cast name should not be empty",
      });
    }

    const newCast = await Cast.create({ name });
    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Success to add new cast",
      result: {
        id: newCast.id,
        name: newCast.name,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getCast = async function (req, res) {
  try {
    if (req.role !== "admin") {
      return res.status(http.HTTP_STATUS_FORBIDDEN).json({
        success: false,
        message: "Forbidden",
      });
    }

    const search = req.query.search || "";
    const casts = await Cast.findAll({
      where: {
        name: {
          [Op.iLike]: `%${search}%`
        }
      },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success to get casts list",
      result: casts,
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};


