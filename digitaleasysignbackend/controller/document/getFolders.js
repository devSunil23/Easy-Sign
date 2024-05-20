const { default: mongoose } = require("mongoose");
const Documents = require("../../models/Document");

/**This function for get folders */
const getfolders = async (req, res) => {
    const { userId, status, folderId, _id } = req.body;
    const ObjectIdToExclude = mongoose.Types.ObjectId(_id);
    try {
        const response = await Documents.aggregate([
            {
                $match: {
                    userId: userId,
                    status: status,
                    folderId: folderId,
                    _id: {
                        $ne: ObjectIdToExclude,
                    },
                },
            },
            {
                $match: {
                    _id: {
                        $ne: ObjectIdToExclude,
                    },
                },
            },
        ]);

        res.status(200).json({
            status: 200,
            data: response,
        });
    } catch (error) {
        res.status(200).json({
            status: 500,
            data: error,
        });
    }
};
module.exports = { getfolders };
