const adminMovieRouter = require("express").Router();
const adminMovieController = require("../controllers/adminMovie.controller");
const {safeUpload} = require("../middlewares/upload.middlewares");
const {addMovieValidation} = require("../utils/validations");
const {handleValidation} = require("../middlewares/validation.middleware");

adminMovieRouter.post("/directors", adminMovieController.addDirector);
adminMovieRouter.get("/directors", adminMovieController.getDirector);
adminMovieRouter.post("/casts", adminMovieController.addCast);
adminMovieRouter.get("/casts", adminMovieController.getCast);
adminMovieRouter.post("/genres", adminMovieController.addGenre);
adminMovieRouter.get("/genres", adminMovieController.getGenre);
adminMovieRouter.post("/movies", safeUpload, addMovieValidation, handleValidation, adminMovieController.addMovie);
adminMovieRouter.patch("/movies/:id", safeUpload, adminMovieController.updateMovie);

module.exports = adminMovieRouter;
