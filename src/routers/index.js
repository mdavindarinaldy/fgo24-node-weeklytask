const authMiddleware = require("../middlewares/verifyToken.middleware");

const routers = require("express").Router();

routers.use("/auth", require("./auth.router"));
routers.use("/profile", authMiddleware, require("./user.router"));

module.exports = routers;