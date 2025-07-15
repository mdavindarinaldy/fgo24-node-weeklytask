const authRouter = require("express").Router();

const authContoller = require("../controllers/auth.controller");

authRouter.post("/login", authContoller.login);
authRouter.post("/register", authContoller.register);

module.exports = authRouter;