const Documents = require("../../models/Document");

/**This function for moved Documents */
const movedDocumentTofolder = async (req, res) => {
    const { _id, folderId } = req.body;
    try {
        const response = await Documents.findByIdAndUpdate(
            _id,
            {
                folderId: folderId,
            },
            { new: true }
        );
        res.status(200).json({ status: 200, data: response });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ status: 500, data: error });
    }
};

module.exports = {
    movedDocumentTofolder,
};
