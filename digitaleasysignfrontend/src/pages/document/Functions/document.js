import eSignApi from "../../../api";
import { getCookie } from "../../../utilities/cookies";

export const movedToTrashDocuments = async (documentRowId) => {
  try {
    let _id = documentRowId;
    const userId = getCookie("userId");
    const responseDocument = await eSignApi.get(
      `/document/statusDeleteDocument/${_id}/${userId}`
    );
    if (responseDocument.data.status === 200) {
      return {
        status: 200,
        message: "Documents moved to trash successfully !",
      };
    } else {
      return { status: 500, message: "Document moved to trash failed !" };
    }
  } catch (error) {
    return { status: 500, message: "Internal server error." };
  }
};

export const permanentDeleteDocumentData = async (documentRowId) => {
  try {
    let id = documentRowId;
    const responseDocument = await eSignApi.get(
      "/document/deleteDocument/" + id
    );

    if (responseDocument.data.status === 200) {
      return {
        status: 200,
        message: "Documents Permanent Deleted successfully !",
      };
    } else {
      return { status: 500, message: "Documents Permanent Deleted failed !" };
    }
  } catch (error) {
    return { status: 500, message: "Internal server error." };
  }
};
/**This is for set voided documents */
export const setVoidedDocuments = async () => {
  try {
    let data = {
      status: "Voided",
      userId: getCookie("userId"),
    };
    const responseDocument = await eSignApi.post(
      "/document/setVoidedDocuments",
      data
    );

    if (responseDocument.data.status === 200) {
      return {
        status: 200,
        message: "Documents set voided successfully!",
      };
    } else {
      return { status: 500, message: "Documents set voided failed!" };
    }
  } catch (error) {
    return { status: 500, message: "Internal server error!" };
  }
};
/**this is for get documents */
export const getDocumentsByStatus = async (
  status,
  startDate,
  endDate,
  folderId
) => {
  try {
    let data = {
      status: status,
      userId: getCookie("userId"),
      startDate: startDate, // Include start date in the request
      endDate: endDate, // Include end date in the request
      folderId,
    };
    const response = await eSignApi.post("/document/getDocuments", data);

    if (response.status === 200) {
      return { status: 200, data: response.data.data };
    } else {
      return { status: 500, data: "error fetching details" };
    }
  } catch (error) {
    return { status: 500, data: "error fetching details" };
  }
};
/**This is function for rename handller */
export const documentsRenameHandller = async (documentRowId, fileName) => {
  try {
    let _id = documentRowId;
    const responseDocument = await eSignApi.post(
      "/document/documentRename/" + _id,
      {
        fileName,
      }
    );

    if (responseDocument.data.status === 200) {
      return {
        status: 200,
        message: "Document rename successfully!",
      };
    } else {
      return { status: 500, message: "Document rename failed !" };
    }
  } catch (error) {
    return { status: 500, message: "Internal server error." };
  }
};
/**This function is sending email for view  */
export const sendViewer = async (viewerEmails, _id, userEmail, userName) => {
  try {
    const responseDocument = await eSignApi.post("/document/sendemailviewer", {
      viewerEmails,
      _id,
      userEmail,
      userName,
    });

    if (responseDocument.data.status === 200) {
      return {
        status: 200,
        message: "Send Email To Viewer Successfully!",
      };
    } else {
      return { status: 500, message: "Send Email To Viewer failed !" };
    }
  } catch (error) {
    return { status: 500, message: "Internal server error." };
  }
};

/**This function is sending email for reminder sign  */
export const sendReminderForSign = async (
  reminderEmails,
  documentDetails,
  userEmail,
  userName
) => {
  try {
    const responseDocument = await eSignApi.post(
      "/document/sendemailReminder",
      {
        reminderEmails,
        documentDetails,
        userEmail,
        userName,
      }
    );

    if (responseDocument.data.status === 200) {
      return {
        status: 200,
        message: "Send Email For Reminder Successfully!",
      };
    } else {
      return { status: 500, message: "Send Email For Reminder failed !" };
    }
  } catch (error) {
    return { status: 500, message: "Internal server error." };
  }
};

/**This functions for revert documents */
export const revertDocuments = async (documentRowId) => {
  const userId = getCookie("userId");
  try {
    let _id = documentRowId;
    const responseDocument = await eSignApi.post("/document/revertdocuments", {
      _id,
      userId,
    });

    if (responseDocument.data.status === 200) {
      return {
        status: 200,
        data: responseDocument.data.data,
        message: "Document revert successfully!",
      };
    } else {
      return { status: 500, message: "Document revert failed !" };
    }
  } catch (error) {
    return { status: 500, message: "Internal server error." };
  }
};

/**This is status update recieved */
export const documentStatusUpdateRecieved = async (documentId, userId) => {
  try {
    const responseDocument = await eSignApi.post("/document/recievedUpdate", {
      documentId,
      userId,
    });
    if (responseDocument.data.status === 200) {
      return {
        status: 200,
        data: responseDocument.data.data,
        message: "Document status updated successfully!",
      };
    } else {
      return { status: 400, message: "Documents status update failed !" };
    }
  } catch (error) {
    return { status: 500, message: "Internal server error." };
  }
};

/**This functions for generate singing link*/
export const generateSingingLinkFunc = async (documentDetails, signerEmail) => {
  try {
    const responseDocument = await eSignApi.post(
      "/document/genereateSigningLink",
      {
        documentDetails,
        signerEmail,
      }
    );

    if (responseDocument.data.status === 200) {
      return {
        status: 200,
        data: responseDocument.data.data,
        message: "Save signerAccesstoken successfully!",
      };
    } else {
      return { status: 404, message: "Save signerAccesstoken failed !" };
    }
  } catch (error) {
    return { status: 500, message: "Internal server error." };
  }
};

/**This functions for get viewer use of viewerAccesstoken */
export const getViewerDocumentId = async (viewerAccessToken) => {
  try {
    const responseDocument = await eSignApi.get(
      `/document/getViewerDocumentId/${viewerAccessToken}`
    );

    if (responseDocument.data.status === 200) {
      return {
        status: 200,
        data: responseDocument.data.data,
        message: "Document get successfully!",
      };
    } else {
      return { status: 500, message: "Documents get failed !" };
    }
  } catch (error) {
    return { status: 500, message: "Internal server error." };
  }
};
//This is for empty trash handller
export const emptyTrashHandller = async () => {
  const userId = getCookie("userId");
  try {
    const responseDocument = await eSignApi.delete(`/document/emptyTrash`, {
      data: {
        userId: userId,
      },
    });

    if (responseDocument.data.status === 200) {
      return {
        status: 200,
        data: responseDocument.data.data,
        message: "Clear Trash successfully!",
      };
    } else {
      return { status: 400, message: "Clear Trash failed !" };
    }
  } catch (error) {
    return { status: 500, message: "Internal server error." };
  }
};

export const getDocumentByIdAndUserId = async (documentId) => {
  const userId = getCookie("userId");
  try {
    const responseDocument = await eSignApi.get(
      `/document/documentsById/${documentId}/${userId}`
    );
    if (responseDocument.data.status === 200) {
      return {
        status: 200,
        data: responseDocument.data.data,
        message: "Document get successfully!",
      };
    } else {
      return { status: 500, message: "Documents get failed !" };
    }
  } catch (error) {
    return { status: 500, message: "Internal server error." };
  }
};

export const getAllDocuments = async (folderId, startDate, endDate) => {
  let data = {
    status: "All",
    userId: getCookie("userId"),
    startDate: startDate, // Include start date in the request
    endDate: endDate, // Include end date in the request
  };
  if (folderId) {
    data.folderId = folderId;
  }

  return await eSignApi.post("/document/getAllDocuments", data);
};

export const defaultSortModel = [
  {
    field: "createdAt",
    sort: "desc", // Set the default sorting order to descending
  },
];
