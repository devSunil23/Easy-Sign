const updateStatusDocument = require("../../functions/document/updateStatus");
/**This function is status update document for particular userId*/
const documentRecievedUpdate = async (req, res) => {
  try {
    const { documentId, userId } = req.body;
    const statusUpdate = await updateStatusDocument(
      documentId,
      "Recieved",
      userId
    );
    res.status(200).json({
      status: 200,
      data: statusUpdate,
      message: "Status update successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: error,
      message: "Interal server error",
    });
  }
};
module.exports = { documentRecievedUpdate };
