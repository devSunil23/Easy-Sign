const { default: axios } = require("axios");
const FormData = require("form-data");

const fileUpload = async (req, res) => {
  const formData = new FormData();
  const files = req.file;
  formData.append("files", files);

  try {
    const apiResponse = await axios.post(
      "https://api.files.clikkle.com/file/private",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: req.headers.authorization,
        },
      }
    );

    res.json(apiResponse.data);
  } catch (error) {
    console.error("Error proxying request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { fileUpload };
