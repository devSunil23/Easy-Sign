const fileUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        } else {
            // File has been uploaded
            res.status(200).json({
                message: "File uploaded successfully",
                files: req.file,
                success: true,
            });
        }
    } catch (error) {
        res.json({ success: false, message: "File uploaded failed" });
    }
};

module.exports = { fileUpload };
