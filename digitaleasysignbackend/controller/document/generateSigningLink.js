const OtherSigner = require("../../models/OtherSigner");

/***generate singing link */
const generateSigningLink = async (req, res) => {
  const { documentDetails, signerEmail } = req.body;
  const { _id, userId } = documentDetails;
  try {
    const getSignerResponse = await OtherSigner.findOne({
      documentId: _id,
      userId: userId,
      signerEmail: signerEmail,
    });

    if (getSignerResponse) {
      res.status(200).json({
        status: 200,
        message: "Signer details fetch successfully!",
        data: getSignerResponse,
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "Signer details fetch failed!",
        data: "",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: error,
      message: "Interal server error",
    });
  }
};
module.exports = { generateSigningLink };
