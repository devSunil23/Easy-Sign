const Documents = require("../../models/Document");

/**This function is rename document */
const renameDocument = async (req, res) => {
    const _id = req.params._id;
    const { fileName } = req.body;
    try {
        const response = await Documents.findByIdAndUpdate(
            _id,
            {
                fileName: fileName,
            },
            { new: true }
        );
        res.status(200).json({ status: 200, data: response });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: 500, data: error });
    }
};
module.exports = { renameDocument };
