const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { generateAccessToken } = require("./generateAccessToken");
const { saveSignerDet } = require("./saveSignerDetails");
const { checkUserExist } = require("./checkUserExistClikkle");
const { updateStatusDocument } = require("./updateStatus");
const Documents = require("../../models/Document");
const { updateStatus } = require("./otherSignerSignStatusUpdate");
const { existUserIdwithDocumentId } = require("./CheckUserExistEsign");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE, // e.g., 'Gmail' or your custom SMTP service
    auth: {
        user: process.env.ADMIN_EMAIL_ID,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
});

const copyRightYear = new Date().getFullYear();

/**send email for sign request*/
const sendEmailForSignRequest = async (
    signingOrder,
    documentTitle,
    userName,
    userEmail,
    documentDetails,
    _id,
    optionalMessage
) => {
    try {
        /**get path viewerEmailTemplate */
        const signerTemplatePath = path.join(
            __dirname,
            "../emailTemplate/signerRequest.html"
        );
        /**This is get file */
        const signerEmailTemplate = fs.readFileSync(
            signerTemplatePath,
            "utf-8"
        );
        const signerSubject = `${documentTitle} - ${userName} requested your signature`;
        let errors = [];
        let sendingStatus = "Draft";
        signingOrder?.map(async (item) => {
            const singerAccessToken = await generateAccessToken(
                item?.email,
                _id
            );
            const saveSignerResposne = await saveSignerDet(
                _id,
                item?.email,
                singerAccessToken,
                userEmail,
                documentDetails.userId
            );
            /**check user exist or not clikkle database if user exist then status update for this user id or save*/
            const existUserResponse = await checkUserExist(item?.email);
            if (existUserResponse.status === 200) {
                const newUserId = existUserResponse.data._id;
                const existDocumentResponse = await existUserIdwithDocumentId(
                    newUserId,
                    _id
                );
                if (existDocumentResponse.status === 200) {
                    const statusUpdate = updateStatusDocument(
                        _id,
                        "Recieved",
                        newUserId
                    );
                } else {
                    const { fileName, fileId, mimetype, size, userName } =
                        documentDetails;
                    const newDocumentsWithThisUserId = new Documents({
                        fileName: fileName,
                        fileId: fileId,
                        mimetype: mimetype,
                        size: size,
                        userId: newUserId,
                        userName: userName,
                        status: "Recieved",
                    });
                    const response = newDocumentsWithThisUserId.save();
                }
            }
            /**replacing with variable */
            const emailContentSigner = signerEmailTemplate
                .replace("${senderName}", userName)
                .replace("${senderEmail}", userEmail)
                .replace(
                    "${viewDocument}",
                    `${process.env.DASHBOARD_CLICKLLE_ESIGN_URL}/otherSinger?signerAccessToken=${singerAccessToken}`
                ) // view document url
                .replace("${copyRightYear}", copyRightYear)
                .replace("${optionalMessage}", optionalMessage)
                .replace("${senderMessage}", "has requested your signature");
            const mailOptions = {
                from: process.env.ADMIN_EMAIL_ID,
                to: item?.email,
                html: emailContentSigner,
                subject: signerSubject,
            };

            // Send the email with the attached PDF
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    sendingStatus = "Failed";
                    errors.push(error);
                } else {
                    /**update status other signer */
                    const updatedSigningOrder = updateStatus(
                        item?.email,
                        "sent",
                        documentDetails.signingOrder
                    );
                    /**update document */
                    const updateDocumentResponse = await Documents.updateOne(
                        { _id: _id },
                        {
                            signingOrder: updatedSigningOrder,
                        },
                        { new: true }
                    );
                }
            });
        });
        /**status update */
        if (sendingStatus !== "Failed") {
            await updateStatusDocument(_id, "Awaiting", documentDetails.userId);
        }
        if (errors.length > 0) {
            console.log("errors", errors);
            return {
                status: 500,
                message: "Email sent failed",
                data: errors,
            };
        } else {
            return {
                status: 200,
                message: "Email sent successfully",
                data: "",
            };
        }
    } catch (error) {
        console.log("error", error);
        return {
            status: 500,
            message: "Email sent failed",
            data: error,
        };
    }
};
module.exports = { sendEmailForSignRequest };
