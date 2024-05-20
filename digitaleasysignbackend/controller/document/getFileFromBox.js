const { default: axios } = require("axios");

/**get file from box  */
const getBoxFile = async (req, res) => {
  try {
    const { authenticated_download_url, accessToken, name } = req.body;
    // Download the file using the temporary link
    const fileResponse = await axios.get(authenticated_download_url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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
module.exports = { getBoxFile };
