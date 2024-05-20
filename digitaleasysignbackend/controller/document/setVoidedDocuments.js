const Documents = require("../../models/Document");
const OtherSigner = require("../../models/OtherSigner");

/**This function for set voided documents */
const setVoidedDocuments = async (req, res) => {
    let voidedDay = 7; /***Write here days for voided */
    try {
        const response = await OtherSigner.aggregate(
            [
                {
                    $match: {
                        updatedAt: {
                            $lte: new Date(
                                Date.now() - voidedDay * 24 * 60 * 60 * 1000
                            ),
                        },
                    },
                },
                {
                    $lookup: {
                        from: "documents",
                        localField: "documentId",
                        foreignField: "_id",
                        as: "result",
                    },
                },
                { $unwind: { path: "$result" } },
                { $match: { "result.status": "Awaiting" } },
                {
                    $project: {
                        _id: "$result._id",
                        status: "$result.status",
                    },
                },
            ],
            { maxTimeMS: 60000, allowDiskUse: true }
        ).exec();
        // Update the status for voided documents in the original Documents collection
        await Documents.updateMany(
            {
                _id: { $in: response.map((doc) => doc._id) },
            },
            { $set: { status: "Voided" } }
        );
        res.status(200).json({
            status: 200,
            data: "voided section added successfully",
        });
    } catch (error) {
        res.status(500).json({ status: 500, data: error });
    }
};
module.exports = { setVoidedDocuments };
