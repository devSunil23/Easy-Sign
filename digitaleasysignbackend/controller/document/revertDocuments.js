const {
    updateStatusDocument,
} = require("../../functions/document/updateStatus");
const Documents = require("../../models/Document");

/**This function for revert document handller */
const revertdocuments = async (req, res) => {
    const { _id, userId } = req.body;
    try {
        const documents = await Documents.findOne({ _id: _id, userId: userId });
        const placeholders = documents.placeholders;
        const singers = documents.signingOrder;
        let updatedSigners = [];
        let updatedPlaceHolders = [];
        placeholders.map((item, index) => {
            updatedPlaceHolders.push({
                ...item,
                checked: null,
                date: new Date(),
                filledText: undefined,
                text: undefined,
                signerType: documents.selectedAction,
            });
        });
        singers.map((item) => {
            updatedSigners.push({
                ...item,
                status: "pending",
            });
        });

        // const statusUpdate = {};
        const updatePlaceHodersDocuments = await Documents?.updateOne(
            { _id: _id, userId: userId },
            { placeholders: updatedPlaceHolders, signingOrder: updatedSigners },
            { new: true }
        );
        const statusUpdate = await updateStatusDocument(_id, "Draft", userId);
        res.status(200).json({ status: 200, data: statusUpdate });
    } catch (error) {
        res.status(500).json({ status: 500, data: error });
    }
};
module.exports = { revertdocuments };
