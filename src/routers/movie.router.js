const movieRouter = require("express").Router();
const movieContoller = require("../controllers/movies.controller");

movieRouter.get("", movieContoller.getMovies);
movieRouter.get("/upcoming", movieContoller.getUpcomingMovies);
movieRouter.get("/:id", movieContoller.getMovieDetail);

module.exports = movieRouter;

