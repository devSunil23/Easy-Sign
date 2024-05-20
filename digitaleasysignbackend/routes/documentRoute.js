const express = require("express");
const router = express.Router();
const { addDocument } = require("../controller/document/addDocument");
const { deleteDocument } = require("../controller/document/deleteDocument");
const { updateDocument } = require("../controller/document/updateDocument");
const { fileUpload } = require("../controller/document/fileUpload");
const { getFile } = require("../controller/document/getfile");
const { sendMail } = require("../controller/document/sendMail");
const { emptyTrashHandller } = require("../controller/document/emptyTrash");
const { folderCreate } = require("../controller/document/folderCreate");
const { getfolders } = require("../controller/document/getFolders");
const { getAllDocuments } = require("../controller/document/getAllDocuments");
const {
    getStatusBasedDocuments,
} = require("../controller/document/getStatusBasedDocument");
const {
    getRecievedDocuments,
} = require("../controller/document/getRecievedDocuments");
const {
    setVoidedDocuments,
} = require("../controller/document/setVoidedDocuments");
const {
    getOtherSingerdetails,
} = require("../controller/document/getOtherSignerDocuments");
const { revertdocuments } = require("../controller/document/revertDocuments");
const {
    documentRecievedUpdate,
} = require("../controller/document/recievedUpdate");
const {
    generateSigningLink,
} = require("../controller/document/generateSigningLink");
const {
    getViewerDocument,
} = require("../controller/document/getViewerDocument");
const {
    documentMoveToTrash,
} = require("../controller/document/documentMoveToTrash");
const { renameDocument } = require("../controller/document/renameDocument");
const {
    movedDocumentTofolder,
} = require("../controller/document/moveDocumentsFolder");
const {
    getDocumentByUserIdAndId,
} = require("../controller/document/getDocumentById");
const { sendEmailForView } = require("../controller/document/sendEmailForview");
const {
    sendEmailforReminder,
} = require("../controller/document/sendEmailReminder");
const {
    getFileGoogleDrive,
} = require("../controller/document/getFileFromGoogleDrive");
const {
    getOneDriveFile,
} = require("../controller/document/getFileFromOnedrive");
const { getDropBoxFile } = require("../controller/document/getFileFromDropBox");
const { getBoxFile } = require("../controller/document/getFileFromBox");
const { getAuthCodeBox } = require("../controller/document/getAuthCodeforBox");
const {
    getAuthCodeDropBox,
} = require("../controller/document/getAuthCodeforDropBox");
const { upload } = require("../middleware/document/fileupload");

// Handle file uploads
router.post("/upload", upload.single("files"), fileUpload);

/**documents add */
router.post("/addDocument", addDocument);

/**This is routes for clear trash**/
router.delete("/emptyTrash", emptyTrashHandller);

/**This routes for folder create */
router.post("/folderCreate", folderCreate);

/**This routes for get folder */
router.post("/getfolders", getfolders);

/**get all documents except of voided and deleted*/
router.post("/getAllDocuments", getAllDocuments);

/**This routes for get status based documents */
router.post("/getDocuments", getStatusBasedDocuments);

/**This routes for get user recieved documents */
router.post("/getReceivedDocuments", getRecievedDocuments);

/**This routes for set voided documents */
router.post("/setVoidedDocuments", setVoidedDocuments);

/**get other signer details with documents */
router.post("/othersignerDocuments", getOtherSingerdetails);

/**This is routes for revert document*/
router.post("/revertdocuments", revertdocuments);

/**This is routes generate siging link */
router.post("/genereateSigningLink", generateSigningLink);

/**This is routes status update for particular route Recieved */
router.post("/recievedUpdate", documentRecievedUpdate);

/**This is routes for get viewer accessToien details use of view**/
router.get("/getViewerDocumentId/:viewerAccessToken", getViewerDocument);

/**This routes is delete document id*/
router.get("/deleteDocument/:id", deleteDocument);

/***This routes for only Document status update in deleted */
router.get("/statusDeleteDocument/:_id/:userId", documentMoveToTrash);

/**This routes for rename document*/
router.post("/documentRename/:_id", renameDocument);

/***This routes for moved to document***/
router.post("/movedDocument", movedDocumentTofolder);

/**This is routes for update document */
router.post("/updateDocument", updateDocument);

/**This routes for document by use of user id and document id */
router.get("/documentsById/:_id/:userId", getDocumentByUserIdAndId);

/***********get pdf using fileId */
router.get("/file/private/:fileId", getFile);

/**This is email send for view */
router.post("/sendemailviewer", sendEmailForView);

//This is email send for reminder
router.post("/sendemailReminder", sendEmailforReminder);

/****This is for send email */
router.post("/sendMail", sendMail);

/**get file from google drive */
router.post("/get-google-drive-file", getFileGoogleDrive);

/**get file form ove drive */
router.post("/get-one-drive-file", getOneDriveFile);

/**get file from drop box */
router.post("/get-dropbox-file", getDropBoxFile);

/**get file from box */
router.post("/get-box-file", getBoxFile);

/**get accessToken for drop box */
router.post("/getAuthCodeDropBox", getAuthCodeDropBox);

/**get accessToken for box**/
router.post("/getAuthCodeBox", getAuthCodeBox);

module.exports = router;
