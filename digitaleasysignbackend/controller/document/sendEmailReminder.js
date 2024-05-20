const fs = require("fs");
const path = require("path");
const OtherSigner = require("../../models/OtherSigner");
const {
  generateAccessToken,
} = require("../../functions/document/generateAccessToken");
const { saveSignerDet } = require("../../functions/document/saveSignerDetails");
const nodemailer = require("nodemailer");
//send email for remainder for sign
const sendEmailforReminder = (req, res) => {
  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE, // e.g., 'Gmail' or your custom SMTP service
    auth: {
      user: process.env.ADMIN_EMAIL_ID,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
  });

  const copyRightYear = new Date().getFullYear();
  const { reminderEmails, documentDetails, userEmail, userName } = req.body;
  try {
    /**get path viewerEmailTemplate */
    const signerTemplatePath = path.join(
      __dirname,
      "../../emailTemplate/signerRequest.html"
    );
    /**This is get file */
    const signerEmailTemplate = fs.readFileSync(signerTemplatePath, "utf-8");
    const signerSubject = `${documentDetails.fileName} - ${userName} requested your signature`;
    let errors = [];
    /**sending meail for reminder mails */
    reminderEmails?.map(async (item) => {
      let singerAccessToken;
      const response = await OtherSigner.findOne({
        documentId: documentDetails._id,
        userEmail: userEmail,
        signerEmail: item,
      });
      if (response) {
        singerAccessToken = response.signerAccessToken;
      } else {
        const accessToken = await generateAccessToken(
          item,
          documentDetails._id
        );
        const saveSignerResposne = await saveSignerDet(
          documentDetails._id,
          item,
          accessToken,
          userEmail,
          documentDetails.userId
        );
        if (saveSignerResposne) {
          singerAccessToken = accessToken;
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
        .replace("${optionalMessage}", "")
        .replace("${senderMessage}", "sent you a reminder"); // view document url
      const mailOptions = {
        from: process.env.ADMIN_EMAIL_ID,
        to: item,
        html: emailContentSigner,
        subject: signerSubject,
      };

      // Send the email with the attached PDF
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          errors.push(error);
        } else {
        }
      });
    });

    if (errors.length > 0) {
      console.log("errors", errors);
      res.status(500).json({
        status: 500,
        message: "Email sent failed",
        data: errors,
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Email sent successfully",
        data: "",
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: 500,
      message: "Email sent failed",
      data: error,
    });
  }
};
module.exports = { sendEmailforReminder };
