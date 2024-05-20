const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { checkUserExist } = require("./checkUserExistClikkle");
const { updateStatusDocument } = require("./updateStatus");
const { generateAccessToken } = require("./generateAccessToken");
const { saveViewerDet } = require("./saveViewerDetails");
const { updateStatus } = require("./otherSignerSignStatusUpdate");
const Documents = require("../../models/Document");

const copyRightYear = new Date().getFullYear();
// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE, // e.g., 'Gmail' or your custom SMTP service
    auth: {
        user: process.env.ADMIN_EMAIL_ID,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
});

/**This is send email other signer has been signed */
const sendMailotherSingerHasbeenSigned = async (
    otherSignerEmail,
    documentTitle,
    userName,
    userEmail,
    documentDetails,
    _id
) => {
    try {
        /**get path viewerEmailTemplate */
        const signerTemplatePath = path.join(
            __dirname,
            "../emailTemplate/signedOther.html"
        );
        /**check this signer email exist clikkle database*/
        const existUserResponse = await checkUserExist(otherSignerEmail);
        if (existUserResponse.status === 200) {
            const newUserId = existUserResponse.data._id;
            /**This is status update for particular signer which exist clikkle and esign database */
            const statusUpdate = updateStatusDocument(
                _id,
                "Completed",
                newUserId
            );
        }
        /**This is get file */
        const signerEmailTemplate = fs.readFileSync(
            signerTemplatePath,
            "utf-8"
        );
        const signerSubject = `${documentTitle} has been signed`;
        const viewerAccessToken = await generateAccessToken(
            otherSignerEmail,
            _id
        );
        /**save viewerAcessToken */
        const saveViewerAccessToken = await saveViewerDet(
            _id,
            viewerAccessToken
        );
        let errors = [];
        /**replacing with variable */
        const emailContentSigner = signerEmailTemplate
            .replace("${senderName}", userName)
            .replace("${senderEmail}", otherSignerEmail)
            .replace(
                "${viewDocument}",
                `${process.env.DASHBOARD_CLICKLLE_ESIGN_URL}/documents/preview?viewerAccessToken=${viewerAccessToken}`
            ) // view document url
            .replace("${copyRightYear}", copyRightYear)
            .replace("${document}", documentTitle);
        const mailOptions = {
            from: process.env.ADMIN_EMAIL_ID,
            to: userEmail,
            html: emailContentSigner,
            subject: signerSubject,
        };

        // Send the email with the attached PDF
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error);
                errors.push(error);
            } else {
                /**This is for update other signer sign a document */
                const updatedSigningOrder = updateStatus(
                    otherSignerEmail,
                    "signed",
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
                /**here logic for when all requested signer complete sign or not.*/
                // Check if all signers have the status "signed"
                const allSignersSigned = updatedSigningOrder.every(
                    (item) => item.status === "signed"
                );

                // Update document status based on the condition
                const newStatus = allSignersSigned ? "Completed" : "Awaiting";

                // Update the document status
                await updateStatusDocument(
                    _id,
                    newStatus,
                    documentDetails.userId
                );
            }
        });
        if (errors.length > 0) {
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
module.exports = {
    sendMailotherSingerHasbeenSigned,
};
