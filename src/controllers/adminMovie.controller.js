const {constants: http} = require("http2");
const {Director, Cast, Genre, Movie, sequelize} = require("../models");
const {Movies_Genres, Movies_Directors, Movies_Casts} = require("../models");
const fs = require("fs");
const path = require("path");
const {Op} = require("sequelize");
const redis = require("../db/redis");

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

exports.addGenre = async function (req, res) {
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
        message: "Genre name should not be empty",
      });
    }

    const newGenre = await Genre.create({ name });
    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Success to add new genre",
      result: {
        id: newGenre.id,
        name: newGenre.name,
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

exports.getGenre = async function (req, res) {
  try {
    if (req.role !== "admin") {
      return res.status(http.HTTP_STATUS_FORBIDDEN).json({
        success: false,
        message: "Forbidden",
      });
    }

    const genres = await Genre.findAll({
      attributes: ["id", "name"],
      order: [["id", "ASC"]],
    });

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success to get genres list",
      result: genres,
    });
  } catch (err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.addMovie = async (req, res) => {
  const role = req.role;
  const userId = req.userId;

  if (role !== "admin") {
    return res.status(http.HTTP_STATUS_FORBIDDEN).json({
      success: false,
      message: "Forbidden",
    });
  }

  const {
    title, synopsis, releaseDate, price, runtime,
    genres, directors, casts
  } = req.body;

  const poster = req.files?.poster?.[0]?.filename;
  const backdrop = req.files?.backdrop?.[0]?.filename;

  if (!poster || !backdrop) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Poster and backdrop should not be empty",
    });
  }

  const now = new Date();
  const t = await sequelize.transaction();
  try {
    const movie = await Movie.create({
      title,
      synopsis,
      release_date: releaseDate,
      price,
      runtime,
      poster,
      backdrop,
      created_by: userId,
      created_at: now,
      updated_at: now
    }, { transaction: t });

    await movie.addGenres(genres.split(", ").map(id => parseInt(id)), { transaction: t });
    await movie.addDirectors(directors.split(", ").map(id => parseInt(id)), { transaction: t });
    await movie.addCasts(casts.split(", ").map(id => parseInt(id)), { transaction: t });

    await t.commit();

    try {
      const keys = await redis.keys("/movies?*");
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      await redis.del("/movies/upcoming");
    } catch (err) {
      console.error(err.message);
    }

    const createdMovie = await Movie.findByPk(movie.id, {
      include: [
        { model: Genre, as: "genres", through: { attributes: [] } },
        { model: Director, as: "directors", through: { attributes: [] } },
        { model: Cast, as: "casts", through: { attributes: [] } },
      ]
    });

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Success to add new movie",
      results: createdMovie
    });
  } catch (err) {
    await t.rollback();
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateMovie = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const movieId = req.params.id;
    const {
      title, synopsis, releaseDate, price, runtime,
      genres, directors, casts
    } = req.body;

    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({ 
        success: false, 
        message: "Movie not found" 
      });
    }
    const updatedData = {
      ...(title && { title }),
      ...(synopsis && { synopsis }),
      ...(releaseDate && { releaseDate }),
      ...(price && { price }),
      ...(runtime && { runtime }),
      updatedAt: new Date()
    };

    if (req.files?.poster?.[0]) {
      const newPoster = req.files.poster[0].filename;
      if (movie.poster) {
        const oldPosterPath = path.join("uploads", "poster", movie.poster);
        if (fs.existsSync(oldPosterPath)) {
          fs.unlinkSync(oldPosterPath);
        }
      }
      updatedData.poster = newPoster;
    }

    if (req.files?.backdrop?.[0]) {
      const newBackdrop = req.files.backdrop[0].filename;
      if (movie.backdrop) {
        const oldBackdropPath = path.join("uploads", "backdrop", movie.backdrop);
        if (fs.existsSync(oldBackdropPath)) {
          fs.unlinkSync(oldBackdropPath);
        }
      }
      updatedData.backdrop = newBackdrop;
    }

    await Movie.update(updatedData, { 
      where: { id: movieId },
      transaction: t
     });

    if (genres) {
      await Movies_Genres.destroy({ where: { id_movie: movieId } });
      const genreIds = genres.split(", ").map(id => ({ 
        id_genre: id, 
        id_movie: movieId 
      }));
      await Movies_Genres.bulkCreate(genreIds, { transaction: t });
    }
    if (directors) {
      await Movies_Directors.destroy({ where: { id_movie: movieId } });
      const directorIds = directors.split(", ").map(id => ({ 
        id_director: id, 
        id_movie: movieId 
      }));
      await Movies_Directors.bulkCreate(directorIds, { transaction: t });
    }
    if (casts) {
      await Movies_Casts.destroy({ where: { id_movie: movieId } });
      const castIds = casts.split(", ").map(id => ({ 
        id_cast: id, 
        id_movie: movieId 
      }));
      await Movies_Casts.bulkCreate(castIds, { transaction: t });
    }

    await t.commit();

    const createdMovie = await Movie.findByPk(movieId, {
      include: [
        { model: Genre, as: "genres", through: { attributes: [] } },
        { model: Director, as: "directors", through: { attributes: [] } },
        { model: Cast, as: "casts", through: { attributes: [] } },
      ]
    });

    res.status(http.HTTP_STATUS_OK).json({ 
      success: true, 
      message: "Movie updated successfully",
      results: createdMovie
    });
  } catch(err) {
    await t.rollback();
    console.error(err);
    res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};