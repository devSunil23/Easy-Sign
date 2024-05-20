const Documents = require("../../models/Document");

/**check user id and document id exist or not clikkle esign database */
const existUserIdwithDocumentId = async (userId, documentId) => {
    try {
        const response = Documents.findOne({ userId, _id: documentId });
        if (response) {
            return {
                status: 200,
                data: response,
                message: "Document aleady exist with this user Id",
            };
        } else {
            return {
                status: 404,
                data: "",
                message: "Document not exist with this user Id",
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
module.exports = { existUserIdwithDocumentId };
