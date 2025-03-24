const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.memoryStorage(), 
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error("Only .jpg, .jpeg, and .png formats allowed!"));
    }
  },
});

module.exports = upload;
