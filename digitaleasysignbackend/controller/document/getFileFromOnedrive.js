const { default: axios } = require("axios");

const getOneDriveFile = async (req, res) => {
  // Initialize the Google Drive API on your server
  try {
    const { id, authToken } = req.body;

    // Make a request to the OneDrive API to get the file's download URL
    const metadataResponse = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/items/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    // Extract the download URL from the response
    const downloadUrl = metadataResponse.data["@microsoft.graph.downloadUrl"];

    // Make a request to the download URL and pipe the response to the client
    const downloadResponse = await axios.get(downloadUrl, {
      responseType: "stream",
    });

    // Set the appropriate response headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${metadataResponse.data.name}`
    );
    res.setHeader("Content-Type", metadataResponse.data.file.mimeType);

    // Pipe the download response to the client response
    downloadResponse.data.pipe(res);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
};
module.exports = { getOneDriveFile };
