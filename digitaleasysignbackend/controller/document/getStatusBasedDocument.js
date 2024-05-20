const Documents = require("../../models/Document");

/**get status based documents */
const getStatusBasedDocuments = async (req, res) => {
    const { startDate, endDate, folderId } = req.body;
    // Assuming endDate is provided as the end of the day
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    let matchStage;

    if (folderId) {
        // If folderId is not null, match userId, status, and folderId
        matchStage = {
            userId: req.body.userId,
            status: { $in: [req.body.status, "Folder"] },
            createdAt: {
                $gte: new Date(startDate),
                $lte: endOfDay,
            },
            folderId: folderId,
        };
    } else {
        // If folderId is null, match only userId and status
        matchStage = {
            userId: req.body.userId,
            status: { $in: [req.body.status, "Folder"] },
            createdAt: {
                $gte: new Date(startDate),
                $lte: endOfDay,
            },
            $or: [
                { folderId: "parents" }, // Include documents where folderId is equal to "parents"
                { folderId: { $exists: false } }, // Include documents where folderId does not exist
            ],
        };
    }

    try {
        const response = await Documents.aggregate([
            {
                $match: matchStage,
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
module.exports = { getStatusBasedDocuments };
