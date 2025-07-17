const userRouter = require("express").Router();
const path = require("node:path");
const multer = require("multer");
const {v4: uuid} = require("uuid");

const storage = multer.diskStorage({
  destination: (req, file, cb)=> {
    cb(null, path.join("uploads","profile-picture"));
  },
  filename: (req, file, cb)=>{
    const ext = path.extname(file.originalname);
    const savedFile = `${uuid()}${ext}`;
    cb(null, savedFile);
  }
});
const profilePicture = multer({storage});

const userController = require("../controllers/users.controller");

userRouter.delete("/:id", userController.deleteUser);
userRouter.get("", userController.getAllUser);
userRouter.get("/:id", userController.getUser);
userRouter.patch("/:id", profilePicture.single("picture"), userController.updateUser);

module.exports = userRouter;