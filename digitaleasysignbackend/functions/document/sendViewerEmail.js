const path = require("path");
const fs = require("fs");
const { generateAccessToken } = require("./generateAccessToken");
const { saveViewerDet } = require("./saveViewerDetails");
const nodemailer = require("nodemailer");

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE, // e.g., 'Gmail' or your custom SMTP service
  auth: {
    user: process.env.ADMIN_EMAIL_ID,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

/**This is email for send view */
const sendViewerEmail = async (viewerEmails, _id, userName, userEmail) => {
  const copyRightYear = new Date().getFullYear();
  try {
    /**get path viewerEmailTemplate */
    const viewerTemplatePath = path.join(
      __dirname,
      "../emailTemplate/viwerEmailTemplate.html"
    );
    /**This is get file */
    const viwerEmailTemplate = fs.readFileSync(viewerTemplatePath, "utf-8");
    const viewerAccessToken = await generateAccessToken(userEmail, _id);
    /**save viewerAcessToken */
    const saveViewerAccessToken = await saveViewerDet(_id, viewerAccessToken);
    const viewerSubject = `Sent you a document to view`;
    /**replacing with variable */
    const emailContentViewer = viwerEmailTemplate
      .replace("${senderName}", userName)
      .replace("${senderEmail}", userEmail)
      .replace(
        "${viewDocument}",
        `${process.env.DASHBOARD_CLICKLLE_ESIGN_URL}/documents/preview?viewerAccessToken=${viewerAccessToken}`
      ) // view document url
      .replace("${copyRightYear}", copyRightYear); // view document url

    let errors = [];

    viewerEmails?.map((email) => {
      const mailOptions = {
        from: process.env.ADMIN_EMAIL_ID,
        to: email,
        html: emailContentViewer,
        subject: viewerSubject,
      };

      // Send the email with the attached PDF
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          errors.push(error);
        }
      });
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
    return { status: 500, message: "Email sent failed", data: error };
  }
};

module.exports = { sendViewerEmail };
