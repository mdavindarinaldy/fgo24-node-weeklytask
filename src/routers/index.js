const authMiddleware = require("../middlewares/auth.middleware");

const routers = require("express").Router();

routers.use("/auth", require("./auth.router"));
routers.use("/users", authMiddleware, require("./user.router"));

module.exports = routers;