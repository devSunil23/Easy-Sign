const { sendViewerEmail } = require("../../functions/document/sendViewerEmail");

/**send email for view */
const sendEmailForView = async (req, res) => {
  const { viewerEmails, _id, userName, userEmail } = req.body;
  const responseData = await sendViewerEmail(
    viewerEmails,
    _id,
    userName,
    userEmail
  );
  res.status(responseData.status).json(responseData);
};
module.exports = { sendEmailForView };
