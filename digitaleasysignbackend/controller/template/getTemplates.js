const Templates = require("../../models/Template");

// get All Templates
const getTemplates = async (req, res) => {
  // console.log(req.body.userId)
  Templates.find({ userId: req.body.userId })
    .then((result) => {
      return res.status(200).json({ status: 200, data: result });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ error: error });
    });
};

module.exports = { getTemplates };
