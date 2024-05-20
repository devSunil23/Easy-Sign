const Documents = require("../../models/Document");
const OtherSigner = require("../../models/OtherSigner");

const getOtherSingerdetails = async (req, res) => {
    try {
        const { signerAccessToken } = req.body;
        const signerResponse = await OtherSigner.findOne({
            signerAccessToken: signerAccessToken,
        });
        if (signerResponse) {
            const responseocumentDetails = await Documents.findOne({
                _id: signerResponse.documentId,
            });

            let signingOrder = responseocumentDetails.signingOrder;

            // Find the object with the matching email
            let targetObject = signingOrder.find(
                (item) => item.email === signerResponse.signerEmail
            );

            // Update the viewedDates if the object is found
            if (targetObject) {
                targetObject.viewedDates.push(new Date()); // Add the current date, for example
                targetObject.status = "viewed";
            }

            /**update siging order vieved dates and status update to sent to viewed */
            const updateResponse = await Documents.updateOne(
                {
                    _id: signerResponse.documentId,
                    userId: signerResponse.userId,
                },
                {
                    signingOrder: signingOrder,
                }
            );

            if (responseocumentDetails) {
                res.status(200).json({
                    status: 200,
                    data: {
                        singerEmail: signerResponse.signerEmail,
                        userEmail: signerResponse.userEmail,
                        responseocumentDetails,
                    },
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            error,
        });
    }
};
module.exports = { getOtherSingerdetails };
