const Templates = require("../../models/Template");

const getTemplateById = async (req, res) => {
  Templates.findOne({ _id: req.params.id, userId: req.body.userId })
    .then((result) => {
      return res.status(200).json({ data: result });
    })
    .catch((error) => {
      console.log(error);
      return res.status(404).json({ error: error });
    });
};

module.exports = { getTemplateById };
