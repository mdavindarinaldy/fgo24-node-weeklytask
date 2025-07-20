const movieRouter = require("express").Router();
const movieContoller = require("../controllers/movies.controller");

movieRouter.get("", movieContoller.getMovies);

module.exports = movieRouter;

