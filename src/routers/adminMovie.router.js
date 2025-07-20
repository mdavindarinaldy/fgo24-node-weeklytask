const adminMovieRouter = require("express").Router();
const adminMovieController = require("../controllers/adminMovie.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");

adminMovieRouter.post("/directors", verifyToken, adminMovieController.addDirector);
adminMovieRouter.get("/directors", verifyToken, adminMovieController.getDirector);

module.exports = adminMovieRouter;
