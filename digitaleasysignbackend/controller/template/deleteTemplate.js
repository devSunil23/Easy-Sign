const Templates = require("../../models/Template");

//delete template by Id
const deleteTemplate = async (req, res) => {
  Templates.deleteOne({ _id: req.params.id }, function (err, data) {
    if (data != null) {
      return res.status(200).json({
        status: 200,
        data: "Deleted",
      });
    }
  });
};

module.exports = {
  deleteTemplate,
};
