const { default: axios } = require("axios");

const getFileGoogleDrive = async (req, res) => {
  // Initialize the Google Drive API on your server
  try {
    const { id, authToken } = req.body;
    const response = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${id}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        responseType: "stream",
      }
    );
    response.data.pipe(res);
  } catch (error) {
    console.log("error", error);
  }
};
module.exports = { getFileGoogleDrive };
