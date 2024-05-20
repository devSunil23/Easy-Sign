import axios from "axios";
import { env } from "../utilities/function";
import { getCookie } from "../utilities/cookies";

/**This is function for create folder */
export const createFolderFunction = async (fileName, folderId, userName) => {
  try {
    let data = {
      fileName: fileName,
      folderId: folderId,
      documentType: "folder",
      userName: userName,
      status: "Folder",
      userId: getCookie("userId"),
    };
    const responseDocument = await axios.post(
      env("BACKEND_SERVER") + "/document/folderCreate",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      }
    );
    if (responseDocument.data.status === 200) {
      return {
        status: 200,
        message: "Folder Created successfully!",
      };
    } else {
      return { status: 500, message: "Folder Creation failed!" };
    }
  } catch (error) {
    return { status: 500, message: "Internal server error!" };
  }
};
/**This is function for get folders */
export const getFolders = async (status, documentId, folderId) => {
  try {
    let data = {
      status: status,
      userId: getCookie("userId"),
      folderId: folderId,
      _id: documentId,
    };
    const response = await axios.post(
      env("BACKEND_SERVER") + "/document/getfolders",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      }
    );
    if (response.status === 200) {
      return { status: 200, data: response.data.data };
    } else {
      return { status: 500, data: "error fetching folders" };
    }
  } catch (error) {
    return { status: 500, data: "error fetching folders" };
  }
};
/**This is function for moved documents*/
export const movedDocumentToFolder = async (_id, folderId) => {
  try {
    let data = {
      _id: _id,
      folderId: folderId,
    };
    const responseDocument = await axios.post(
      env("BACKEND_SERVER") + "/document/movedDocument",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      }
    );
    if (responseDocument.data.status === 200) {
      return {
        status: 200,
        message: "Document moved successfully!",
      };
    } else {
      return { status: 500, message: "Document moved failed!" };
    }
  } catch (error) {
    return { status: 500, message: "Internal server error!" };
  }
};
