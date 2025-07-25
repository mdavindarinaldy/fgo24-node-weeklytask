const verifyToken = require("../middlewares/verifyToken.middleware");

const routers = require("express").Router();

routers.use("/auth", require("./auth.router"));
routers.use("/profile", verifyToken, require("./user.router"));
routers.use("/admin", verifyToken, require("./adminMovie.router"));
routers.use("/admin", verifyToken, require("./adminTransaction.router"));
routers.use("/movies", require("./movie.router"));
routers.use("/transactions", verifyToken, require("./transaction.router"));

module.exports = routers;