const Documents = require("../../models/Document");
const updateDocument = async (req, res) => {
    try {
        let opts = {
            runValidators: true,
            setDefaultsOnInsert: true,
            upsert: false,
            context: "query",
            new: true,
        };
        const response = await Documents.updateOne(
            { _id: req.body._id },
            {
                signingOrder: req.body.signingOrder,
                viewers: req.body.viewers,
                placeholders: req.body.placeholders,
                selectedAction: req.body.selectedAction,
            },
            opts
        );
        if (response) {
            return res.status(200).json({ status: 200, data: response });
        } else {
            return res
                .status(500)
                .json({ status: 500, data: "Update document failed" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, data: "Update document failed" });
    }
};
module.exports = { updateDocument };
