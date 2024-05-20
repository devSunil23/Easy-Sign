const Documents = require("../../models/Document");
/**This function for add document */
const addDocument = async (req, res) => {
    try {
        const Documents1 = new Documents({
            fileName: req.body.name,
            fileId: req.body.id,
            mimetype: req.body.mimetype,
            size: req.body.size,
            userId: req.body.userId,
            userName: req.body.userName,
            signingOrder: req.body.signingOrder ? req.body.signingOrder : [],
            viewers: req.body.viewers ? req.body.viewers : [],
            placeholders: req.body.placeholders ? req.body.placeholders : [],
            selectedAction: req.body.selectedAction
                ? req.body.selectedAction
                : "",
        });
        const response = await Documents1.save();
        // Handle success
        return res.status(200).json({ status: 200, data: response });
    } catch (error) {
        // Handle error
        return res.status(400).json({ status: 400, data: {} });
    }
};
module.exports = {
    addDocument,
};
