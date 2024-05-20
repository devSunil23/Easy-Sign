const Documents = require("../../models/Document");

/**This function delete all documents which match this user id and status is Trash */
const emptyTrashHandller = async (req, res) => {
    const { userId } = req.body;
    try {
        const response = await Documents.deleteMany({
            userId: userId,
            status: "Trash",
        });

        if (response) {
            res.status(200).json({
                status: 200,
                message: "Cleart Trash successfully!",
                data: "",
            });
        } else {
            res.status(400).json({
                status: 400,
                message: "Clear Trash failed!",
                data: "",
            });
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({
            status: 500,
            data: error,
            message: "Interal server error",
        });
    }
};
module.exports = { emptyTrashHandller };
