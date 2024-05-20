const { default: mongoose } = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const { Readable } = require("stream");
const multer = require("multer");

// Update PDF function
const fileUpdate = async (updatedPdfData) => {
  try {
    const storage = new GridFsStorage({
      db: mongoose.connection,
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          // Create a readable stream from the Uint8Array
          const readableStream = new Readable();
          readableStream.push(updatedPdfData);
          readableStream.push(null);

          const fileInfo = {
            filename: "updated.pdf",
            bucketName: "pdfFiles",
            // Pass the readable stream to the GridFS storage
            stream: readableStream,
          };

          resolve(fileInfo);
        });
      },
    });

    const upload = multer({ storage: storage });
    console.log("upload", upload);
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

module.exports = {
  fileUpdate,
};
