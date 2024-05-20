const express = require("express");
const router = express.Router();
const multer = require("multer");
const { fileUpload } = require("../controller/proxy/uploadFile");
const storage = multer.memoryStorage(); // Store uploaded files in memory (you can also specify a disk storage path)
const upload = multer({ storage });

/**This routes upload files clikkle files */
router.post("/upload", upload.single("files"), fileUpload);

module.exports = router;
