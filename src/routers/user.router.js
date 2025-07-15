const userRouter = require("express").Router();

const userController = require("../controllers/users.controller");

userRouter.delete("/:id", userController.deleteUser);
userRouter.get("", userController.getAllUser);
userRouter.get("/:id", userController.getUser);
userRouter.patch("/:id", userController.updateUser);

module.exports = userRouter;