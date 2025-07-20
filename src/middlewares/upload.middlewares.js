const multer = require("multer");
const path = require("path");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const {constants: http} = require("http2");

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
    return cb(new Error("Invalid file type. Only .jpg, .jpeg, .png are allowed"), false);
  }
  cb(null, true);
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const safeUpload = (req, res, next) => {
  const uploadHandler = multerUpload.fields([
    { name: "poster", maxCount: 1 },
    { name: "backdrop", maxCount: 1 }
  ]);

  uploadHandler(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({ 
        success: false, 
        message: err.message 
      });
    } else if (err) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({ 
        success: false, 
        message: err.message 
      });
    }
    next();
  });
};

module.exports = { safeUpload };
