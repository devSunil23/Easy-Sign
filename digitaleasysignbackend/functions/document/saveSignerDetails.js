const OtherSigner = require("../../models/OtherSigner");

const saveSignerDet = async (
  _id,
  singerEmail,
  signerAccessToken,
  userEmail,
  userId
) => {
  try {
    const newOtherSigner = new OtherSigner({
      documentId: _id,
      signerEmail: singerEmail,
      signerAccessToken: signerAccessToken,
      userEmail: userEmail,
      userId: userId,
    });
    const response = await newOtherSigner.save();
    console.log("response", response);
    if (response) {
      return {
        status: 200,
        data: response,
        message: "Save signer accesstoken successfully !",
      };
    } else {
      return {
        status: 404,
        data: "",
        message: "Save signer accesstoken failed !",
      };
    }
  } catch (error) {
    return {
      status: 500,
      data: error,
      message: "Interal server error",
    };
  }
};
module.exports = { saveSignerDet };
