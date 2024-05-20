const { default: axios } = require("axios");

const getDropBoxFile = async (req, res) => {
  try {
    const { id, name, accessToken } = req.body;

    // Get temporary link for the file
    const tempLinkResponse = await axios.post(
      "https://api.dropboxapi.com/2/files/get_temporary_link",
      { path: id },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    // Download the file using the temporary link
    const fileResponse = await axios.get(tempLinkResponse.data.link, {
      responseType: "stream",
    });

    // Set response headers
    res.setHeader("Content-Disposition", `attachment; filename=${name}`);
    res.setHeader("Content-Type", fileResponse.headers["content-type"]);

    // Pipe the file stream to the response
    fileResponse.data.pipe(res);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Error to download file" });
  }
};
module.exports = { getDropBoxFile };
