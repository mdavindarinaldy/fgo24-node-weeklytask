const userRouter = require("express").Router();

const userController = require("../controllers/users.controller");

userRouter.delete("/:id", userController.deleteUser);
userRouter.get("", userController.getAllUser);
userRouter.get("/:id", userController.getUser);

module.exports = userRouter;