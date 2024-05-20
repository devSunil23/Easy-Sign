const OtherSigner = require("../../models/OtherSigner");

const getRecievedDocuments = async (req, res) => {
  try {
    const { email, startDate, endDate } = req.body;
    // Assuming endDate is provided as the end of the day
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    const response = await OtherSigner.aggregate(
      [
        {
          $match: {
            signerEmail: email,
            createdAt: {
              $gte: new Date(startDate),
              $lte: endOfDay,
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
        {
          $match: {
            "result.status": "Awaiting",
            createdAt: {
              $gte: new Date(startDate),
              $lte: endOfDay,
            },
          },
        },
        {
          $project: {
            _id: "$result._id",
            fileName: "$result.fileName",
            fileId: "$result.fileId",
            mimetype: "$result.mimetype",
            placeholders: "$result.placeholders",
            signingOrder: "$result.signingOrder",
            viewers: "$result.viewers",
            status: "$result.status",
            userId: "$result.userId",
            userName: "$result.userName",
            signatures: "$result.signatures",
            createdAt: "$result.createdAt",
            selectedAction: "$result.selectedAction",
            signerAccessToken: 1,
            signerEmail: 1,
            userEmail: 1,
          },
        },
      ],
      { maxTimeMS: 60000, allowDiskUse: true }
    ).exec();
    res.status(200).json({ status: 200, data: response });
  } catch (error) {
    res.status(500).json({ status: 500, data: error });
  }
};
module.exports = { getRecievedDocuments };
