const authRouter = require("express").Router();
const authContoller = require("../controllers/auth.controller");
const { registerValidation, loginValidation } = require("../utils/validations");
const { handleValidation } = require("../middlewares/validation.middleware");
const verifyToken = require("../middlewares/verifyToken.middleware");

authRouter.post("/login", loginValidation, handleValidation, authContoller.login);
authRouter.post("/register", registerValidation, handleValidation, authContoller.register);
authRouter.post("/logout", verifyToken, authContoller.logout);

module.exports = authRouter;
