const adminMovieRouter = require("express").Router();
const adminMovieController = require("../controllers/adminMovie.controller");
const multer = require("multer");
const path = require("path");
const {v4: uuid} = require("uuid");
const fs = require("fs");
const {addMovieValidation} = require("../utils/validations");
const {handleValidation} = require("../middlewares/validation.middleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const field = file.fieldname === "poster" ? "poster" : "backdrop";
    const dir = `./uploads/${field}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const savedFile = `${uuid()}${ext}`;
    cb(null, savedFile);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (![".jpg", ".jpeg", ".png"].includes(ext)) {
    return cb(new Error("Invalid file type"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

adminMovieRouter.post("/directors", adminMovieController.addDirector);
adminMovieRouter.get("/directors", adminMovieController.getDirector);
adminMovieRouter.post("/casts", adminMovieController.addCast);
adminMovieRouter.get("/casts", adminMovieController.getCast);
adminMovieRouter.post("/genres", adminMovieController.addGenre);
adminMovieRouter.get("/genres", adminMovieController.getGenre);
adminMovieRouter.post("/movies", upload.fields([{ name: "poster", maxCount: 1 }, { name: "backdrop", maxCount: 1 }]), addMovieValidation, handleValidation, adminMovieController.addMovie);

module.exports = adminMovieRouter;
