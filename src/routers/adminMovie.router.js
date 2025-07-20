const adminMovieRouter = require("express").Router();
const adminMovieController = require("../controllers/adminMovie.controller");

adminMovieRouter.post("/directors", adminMovieController.addDirector);
adminMovieRouter.get("/directors", adminMovieController.getDirector);
adminMovieRouter.post("/casts", adminMovieController.addCast);
adminMovieRouter.get("/casts", adminMovieController.getCast);

module.exports = adminMovieRouter;
