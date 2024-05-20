const Templates = require("../../models/Template");

//addTemplate
const addTemplate = async (req, res) => {
  try {
    const Template = new Templates({
      fileName: req.body.name,
      fileId: req.body.id,
      mimetype: req.body.mimetype,
      size: req.body.size,
      templateName: req.body.templateName,
      templateMessage: req.body.templateMessage,
      createApiTemplate: req.body.createApiTemplate,
      roles: req.body.roles,
      userId: req.body.userId,
      userName: req.body.userName,
    });
    const template = await Template.save();
    return res.status(200).json({ status: 200, data: template });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};

module.exports = { addTemplate };
