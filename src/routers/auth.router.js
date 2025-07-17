const authRouter = require("express").Router();
const authContoller = require("../controllers/auth.controller");
const authDto = require("../dto/auth.dto");
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

authRouter.post("/login", authDto.login, authContoller.login);
authRouter.post("/register", profilePicture.single("picture"), authContoller.register);

module.exports = authRouter;
