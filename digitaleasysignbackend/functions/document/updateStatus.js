const Documents = require("../../models/Document");
/**update status functions */
const updateStatusDocument = async (_id, status, userId) => {
    let updatedData;
    if (status === "Completed") {
        updatedData = {
            status: status,
            completedAt: new Date(),
        };
    } else {
        updatedData = {
            status: status,
        };
    }
    try {
        const updateDocument = await Documents.updateOne(
            { _id: _id, userId: userId },
            updatedData,
            {
                new: true,
            }
        );
        return updateDocument;
    } catch (error) {
        console.log(error);
        return error;
    }
};
module.exports = { updateStatusDocument };
