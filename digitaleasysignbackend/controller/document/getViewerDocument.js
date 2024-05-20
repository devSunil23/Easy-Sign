const OtherViewer = require("../../models/documentViewer");

/**This functionf for get viewer det */
const getViewerDocument = async (req, res) => {
  const { viewerAccessToken } = req.params;
  try {
    const response = await OtherViewer.findOne({ viewerAccessToken });
    res.status(200).json({
      status: 200,
      data: response.documentId,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      data: error,
    });
  }
};
module.exports = { getViewerDocument };
