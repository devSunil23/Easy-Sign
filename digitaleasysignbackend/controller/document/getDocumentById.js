const Documents = require("../../models/Document");

/**get status based documents */
const getDocumentByUserIdAndId = async (req, res) => {
    const { _id, userId } = req.params;
    try {
        const response = await Documents.findOne({ _id: _id, useId: userId });
        if (response) {
            res.status(200).json({
                status: 200,
                data: response,
                message: "Document fetched successfully !",
            });
        } else {
            res.status(200).json({
                status: 404,
                data: "",
                message: "Document not exist !",
            });
        }
    } catch (error) {
        res.status(200).json({
            status: 500,
            message: "Internal server Error",
            data: error,
        });
    }
};

module.exports = {
    getDocumentByUserIdAndId,
};
