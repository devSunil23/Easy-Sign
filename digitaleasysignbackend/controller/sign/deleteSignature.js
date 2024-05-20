const Signature = require("../../models/Sign");
const deleteSignature = async (req, res) => {
  try {
    const signatureId = req.params.id;

    // Find and delete the signature by ID
    const deletedSignature = await Signature.findByIdAndDelete(signatureId);

    if (deletedSignature) {
      res.json({
        message: "Signature deleted successfully",
        signature: deletedSignature,
      });
    } else {
      res.status(404).json({ error: "Signature not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { deleteSignature };
