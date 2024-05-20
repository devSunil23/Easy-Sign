const Signature = require("../../models/Sign");
const addSignature = async (req, res) => {
  try {
    const { signature, signatureType, userId, documentId } = req.body;

    // Create a new signature document
    const newSignature = new Signature({
      signature,
      signatureType,
      userId,
      documentId,
    });

    // Save the signature to the database
    await newSignature.save();

    res.status(201).json({
      message: "Signature added successfully",
      signature: newSignature,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { addSignature };
