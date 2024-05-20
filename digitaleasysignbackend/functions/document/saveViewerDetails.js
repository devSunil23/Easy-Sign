const documentViewer = require("../../models/documentViewer");
const saveViewerDet = async (_id, viewerAccessToken) => {
  const newDocumentViewer = new documentViewer({
    documentId: _id,
    viewerAccessToken: viewerAccessToken,
  });
  newDocumentViewer.save();
};
module.exports = { saveViewerDet };
