const { Op } = require("sequelize");
const {constants: http} = require("http2");
const { Movie, Genre, Director, Cast } = require("../models");
const redis = require("../db/redis");

exports.getMovies = async (req, res) => {
  try {
    let search = req.query.search || "";
    let genreFilter = req.query.genre || "";
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const redisKey = `/movies?search=${search}&genre=${genreFilter}&page=${page}&limit=${limit}`;
    const redisPageKey = `/movies?search=${search}&genre=${genreFilter}&pagedata=${page}&limit=${limit}`;

    const cache = await redis.get(redisKey);
    const cachePage = await redis.get(redisPageKey);

    if (cache && cachePage) {
      return res.status(http.HTTP_STATUS_OK).json({
        success: true,
        message: "Success get movies (from cache)",
        pageInfo: JSON.parse(cachePage),
        results: JSON.parse(cache),
      });
    }

    const searchInfo = {
      title: {
        [Op.iLike]: `%${search}%`,
      },
      release_date: {
        [Op.lt]: new Date(),
      },
    };

    const include = [
      {
        model: Genre,
        as: "genres",
        attributes: ["name"],
        through: { attributes: [] },
      },
      {
        model: Director,
        as: "directors",
        attributes: ["name"],
        through: { attributes: [] },
      },
      {
        model: Cast,
        as: "casts",
        attributes: ["name"],
        through: { attributes: [] },
      },
    ];

    if (genreFilter) {
      include[0].where = {
        name: {
          [Op.iLike]: `%${genreFilter}%`,
        },
      };
    }

    const { count, rows } = await Movie.findAndCountAll({
      where: searchInfo,
      include,
      distinct: true,
    });

    const totalPage = Math.ceil(count / limit);
    if (page > totalPage && totalPage !== 0) {
      page = totalPage;
    }

    const paginatedMovies = rows.slice(offset, offset + limit);
    const pageInfo = {
      totalPage,
      currentPage: page,
      item: `Showing ${paginatedMovies.length} of ${count}`,
      prevPage: page > 1 ? `${req.protocol}://${req.get("host")}/movies?search=${search}&genre=${genreFilter}&page=${page - 1}&limit=${limit}` : null,
      nextPage: page < totalPage ? `${req.protocol}://${req.get("host")}/movies?search=${search}&genre=${genreFilter}&page=${page + 1}&limit=${limit}` : null,
    };

    const formattedMovies = paginatedMovies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      synopsis: movie.synopsis,
      release_date: movie.release_date,
      price: movie.price,
      runtime: movie.runtime,
      poster: movie.poster,
      backdrop: movie.backdrop,
      genres: movie.Genres?.map((g) => g.name).join(", "),
      directors: movie.Directors?.map((d) => d.name).join(", "),
      casts: movie.Casts?.map((c) => c.name).join(", "),
    }));

    await redis.set(redisKey, JSON.stringify(formattedMovies));
    await redis.set(redisPageKey, JSON.stringify(pageInfo));

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Success get movies",
      pageInfo,
      results: formattedMovies,
    });
  } catch(err) {
    console.error(err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to get movies",
    });
  }
};