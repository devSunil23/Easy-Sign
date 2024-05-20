const { default: axios } = require("axios");

/**get accesstoken for box */
const getAuthCodeBox = async (req, res) => {
  const { code, clientId, client_secret, redirect_url } = req.body;
  try {
    const formData = new URLSearchParams();
    formData.append("code", code);
    formData.append("grant_type", "authorization_code");
    formData.append("client_id", clientId);
    formData.append("client_secret", client_secret);
    formData.append("redirect_uri", redirect_url);

    const tokenResponse = await axios.post(
      "https://api.box.com/oauth2/token",
      formData
    );

    // Extract the access token from the response
    const accessToken = tokenResponse.data.access_token;
    // Handle the access token send it to the client)
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: "Failed to obtain access token" });
  }
};
module.exports = { getAuthCodeBox };
