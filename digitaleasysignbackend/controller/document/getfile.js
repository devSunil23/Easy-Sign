const { default: mongoose } = require("mongoose");
const grid = require("gridfs-stream");
const conn = mongoose.connection;
let gfs;
conn.once("open", () => {
  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection("pdfFiles"); // Create or access the 'pdfFiles' collection
});

/**This is for get file using filename*/
let bucket = "";
mongoose.connection.on("connected", () => {
  const db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "pdfFiles",
  });
});
const getFile = async (req, res) => {
  try {
    // const fileId = mongoose.Types.ObjectId(req.params.fileId);
    const fileId = mongoose.Types.ObjectId(req.params.fileId);
    gfs.files
      .find({ _id: mongoose.Types.ObjectId(fileId) })
      .toArray((err, files) => {
        if (err) {
          return res.status(500).json({ error: "An error occurred" });
        }
        if (files.length === 0) {
          return res.status(404).json({ error: "File not found" });
        }
        // Extract the filename from the file details
        const filename = files[0].filename;
        const file = bucket
          .find({
            filename: filename,
          })
          .toArray((err, files) => {
            if (!files || files.length === 0) {
              return res.status(404).json({
                err: "no files exist",
              });
            }
            bucket.openDownloadStreamByName(filename).pipe(res);
          });
      });
  } catch (error) {
    res.status(401).json("file does not exist");
  }
};
module.exports = { getFile };
