const axios = require("axios").default;
const checkUserExist = async (email) => {
  try {
    const response = await (
      await axios.get(
        `https://api.admin.clikkle.com/user-info?email=${email}`,
        {}
      )
    ).data;
    if (response.success) {
      return {
        status: 200,
        data: response.user,
        message: "user exist on clikkle database",
      };
    } else {
      return {
        status: 404,
        data: "",
        message: "user not exist on clikkle database",
      };
    }
  } catch (error) {
    return {
      status: 500,
      data: error,
      message: "Internal server error",
    };
  }
};

module.exports = { checkUserExist };
