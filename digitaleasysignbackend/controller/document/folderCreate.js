const Documents = require("../../models/Document");

/**This function for create folder */
const folderCreate = async (req, res) => {
    const { fileName, folderId, userId, userName, status } = req.body;
    try {
        const documentsNewFolder = new Documents({
            fileName: fileName,
            folderId: folderId,
            documentType: "folder",
            userId: userId,
            userName: userName,
            status: status,
        });
        const response = await documentsNewFolder.save();
        res.status(200).json({ status: 200, data: response });
    } catch (error) {
        res.status(500).json({ status: 500, data: error });
    }
};
module.exports = { folderCreate };
