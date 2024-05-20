const {
  updateStatusDocument,
} = require("../../functions/document/updateStatus");

/**status update to deleted */
const documentMoveToTrash = async (req, res) => {
  try {
    await updateStatusDocument(req.params._id, "Trash", req.params.userId);
    res.status(200).json({ status: 200, data: "Trash" });
  } catch (error) {
    res.status(500).json({ error });
  }
};
module.exports = { documentMoveToTrash };
