const Signature = require("../../models/Sign");
const editSignature = async (req, res) => {
  try {
    const signatureId = req.params.id;
    const { signature, signatureType, userId, documentId } = req.body;

    // Find and update the signature by ID
    const updatedSignature = await Signature.findByIdAndUpdate(
      signatureId,
      { signature, signatureType, userId, documentId },
      { new: true }
    );

    if (updatedSignature) {
      res.json({
        message: "Signature updated successfully",
        signature: updatedSignature,
      });
    } else {
      res.status(404).json({ error: "Signature not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { editSignature };
