const Templates = require("../../models/Template");

// update document
const updateTemplate = async (req, res) => {
  let updateData = {};
  if (req.body.templateName) {
    updateData.templateName = req.body.templateName;
    updateData.templateMessage = req.body.templateMessage;
    updateData.roles = req.body.roles;
    updateData.fileName = req.body.fileName;
    updateData.fileId = req.body.fileId;
    updateData.size = req.body.size;
    updateData.createApiTemplate = req.body.createApiTemplate;
  } else {
    updateData.signingOrder = req.body.signingOrder;
    updateData.viewers = req.body.viewers;
    updateData.placeholders = req.body.placeholders;
    updateData.selectedAction = req.body.selectedAction;
  }

  Templates.updateOne({ _id: req.body._id }, updateData, (error, result) => {
    if (error) {
      return res.status(500).json({ message: "template update failed" });
    } else {
      console.log(result);
      return res.status(200).json({ data: result });
    }
  });
};

module.exports = { updateTemplate };
