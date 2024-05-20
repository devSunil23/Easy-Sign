const Documents = require("../../models/Document");

const deleteDocument = async (req, res) => {
    try {
        const response = await Documents.deleteOne({ _id: req.params.id });
        if (response) {
            return res.status(200).json({
                status: 200,
                data: "Deleted",
            });
        } else {
            return res.status(400).json({
                status: 400,
                data: "",
            });
        }
    } catch (error) {
        // Handle error
        return res.status(400).json({ status: 400, data: {} });
    }
};
module.exports = {
    deleteDocument,
};
