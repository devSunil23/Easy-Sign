const { updatePdf } = require("../../functions/document/pdfUpdate");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { default: mongoose } = require("mongoose");
const {
  updateStatusDocument,
} = require("../../functions/document/updateStatus");
const { sendViewerEmail } = require("../../functions/document/sendViewerEmail");
const {
  sendEmailForSignRequest,
} = require("../../functions/document/sendMailSignRequest");
const {
  sendMailotherSingerHasbeenSigned,
} = require("../../functions/document/sendMailSignerSigned");
const {
  getPdfBinaryData,
} = require("../../functions/document/getPdfBinaryData");
const { fileUpdate } = require("../../functions/document/fileUpdate");

/**This is for get file using filename*/
let bucket = "";
mongoose.connection.on("connected", () => {
  const db = mongoose.connections[0].db;
  bucket = new mongoose.mongo.GridFSBucket(db, {
    bucketName: "pdfFiles",
  });
});

/**This is function for send email */
const sendMail = async (req, res) => {
  try {
    const copyRightYear = new Date().getFullYear();
    const {
      documentTitle,
      optionalMessage,
      userEmail,
      documentDetails,
      otherSignerEmail,
    } = req.body;
    let errors = [];

    /**user details documents */
    const {
      placeholders,
      viewers,
      signingOrder,
      userName,
      selectedAction,
      _id,
      fileId,
    } = documentDetails;
    const filename = documentDetails?.fileName;

    /**get pdf data */
    const existingPdfData = await getPdfBinaryData(filename, bucket);

    /**update pdf */
    const updatedPdfData = await updatePdf(
      existingPdfData,
      placeholders,
      fileId
    );

    /**This function update original pdf */
    const fileupdateResponse = await fileUpdate(updatedPdfData.data);

    if (updatedPdfData.status === 200) {
      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE, // e.g., 'Gmail' or your custom SMTP service
        auth: {
          user: process.env.ADMIN_EMAIL_ID,
          pass: process.env.ADMIN_EMAIL_PASSWORD,
        },
      });

      /**send email to user signer has been signed to email */
      if (otherSignerEmail) {
        const otherSignerEmailResponse = await sendMailotherSingerHasbeenSigned(
          otherSignerEmail,
          documentTitle,
          userName,
          userEmail,
          documentDetails,
          _id
        );

        if (otherSignerEmailResponse.status !== 200) {
          errors.push(otherSignerEmailResponse.data);
        }
      } else if (
        /**send signer request email */
        signingOrder?.length > 0 &&
        signingOrder[0] !== "" &&
        signingOrder[0] !== undefined &&
        signingOrder[0]?.email !== undefined &&
        signingOrder[0]?.email !== "" &&
        !otherSignerEmail
      ) {
        const responseData = await sendEmailForSignRequest(
          signingOrder,
          documentTitle,
          userName,
          userEmail,
          documentDetails,
          _id,
          optionalMessage
        );
        if (responseData.status !== 200) {
          errors.push(responseData.data);
        }
      }
      /**send viewer email */
      if (
        viewers?.length > 0 &&
        viewers[0] !== "" &&
        viewers[0] !== undefined
      ) {
        const responseData = await sendViewerEmail(
          viewers,
          _id,
          userName,
          userEmail
        );
        if (responseData.status !== 200) {
          errors.push(responseData.data);
        }
      }
      /**This if get path where your file is available */

      const emailTemplatePath = path.join(
        __dirname,
        "../../emailTemplate/userNotification.html"
      );

      /**This email send when user complete sign */
      if (selectedAction === "yourself") {
        /**This is get file */
        const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
        const subject = `Everyone has signed ${documentTitle}`;
        /**replacing with variable */
        const emailContent = emailTemplate
          .replace("${subject}", subject)
          .replace(
            "${viewDocument}",
            `${process.env.DASHBOARD_CLICKLLE_ESIGN_URL}/documents/preview?documentId=${_id}`
          ) // view document url
          .replace("${copyRightYear}", copyRightYear); // view document url

        /**email sent final when everyone signed*/
        const mailOptions = {
          from: process.env.ADMIN_EMAIL_ID,
          to: userEmail,
          html: emailContent,
          subject: subject,
          attachments: [
            {
              filename: filename,
              content: updatedPdfData.data,
            },
          ],
        };

        // Send the email with the attached PDF
        transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            errors.push(error);
            console.log(error);
          } else {
            console.log("sent");
            /**status update */
            await updateStatusDocument(
              _id,
              "Completed",
              documentDetails.userId
            );
          }
        });
      }
      if (errors.length > 0) {
        // If there are errors, send a single response with the error messages
        res.status(400).json({
          data: errors,
          message: "Email sent failded",
          status: 400,
        });
      } else {
        // If no errors occurred, send a success response
        res.status(200).json({
          message: "Email sent successfully",
          status: 200,
          data: "",
        });
      }
    } else {
      res.status(updatedPdfData.status).json(updatedPdfData);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ data: error, message: "Email sent failded", status: 500 });
  }
};
module.exports = { sendMail };
