const jwt = require("jsonwebtoken");
const generateAccessToken = async (userEmail, userId) => {
  // Your secret key for signing the token
  const secretKey =
    "1256568988215fsasuabyuknebafdfafdfsfmjjsfsafafsf48858sfsff82222222sfsdfsfasfsf22218822215555sffssfhkfnjkfnskjfsdnfjks";
  // User information to include in the token
  const userData = {
    userId: userId,
    username: userEmail,
    // ... other user data
  };
  // Generate the access token
  const accessToken = jwt.sign(userData, secretKey, { expiresIn: "24h" });
  return accessToken;
};

module.exports = { generateAccessToken };
