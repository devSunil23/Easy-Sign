const mongoose = require("mongoose");
const multer = require("multer");
const grid = require("gridfs-stream");
const { GridFsStorage } = require("multer-gridfs-storage"); //for save files using multer-gridfs-storaage

// Create a GridFS stream instance
const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection("pdfFiles"); // Create or access the 'pdfFiles' collection
});
// Set up Multer for file uploads
const storage = new GridFsStorage({
  db: mongoose.connection,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const fileInfo = {
        filename: file.originalname,
        bucketName: "pdfFiles",
      };
      resolve(fileInfo);
    });
  },
});
const upload = multer({ storage: storage });
module.exports = {
  upload,
};
