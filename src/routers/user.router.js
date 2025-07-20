const userRouter = require("express").Router();
const path = require("node:path");
const multer = require("multer");
const {v4: uuid} = require("uuid");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb)=> {
    const dir = path.join("uploads", "profile-picture");
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb)=>{
    const ext = path.extname(file.originalname);
    const savedFile = `${uuid()}${ext}`;
    cb(null, savedFile);
  }
});
const profilePicture = multer({storage});

const userController = require("../controllers/users.controller");

userRouter.get("/", userController.getUser);
userRouter.post("/check-password", userController.confirmPassword);
userRouter.patch("", profilePicture.single("profilePicture"), userController.updateUser);

module.exports = userRouter;