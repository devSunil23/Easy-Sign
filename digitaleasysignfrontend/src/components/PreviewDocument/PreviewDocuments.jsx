import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCookie } from "../../utilities/cookies";
import axios from "axios";
import { env } from "../../utilities/function";
import { Box, Grid } from "@mui/material";
import PreviewAndSign from "../PreviewAndSign";
import {
  getDocumentByIdAndUserId,
  getViewerDocumentId,
} from "../../pages/document/Functions/document";
import { useMessage } from "../Header/Header";
const PreviewDocuments = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const viewerAccessToken = queryParams.get("viewerAccessToken");
  const documentId = queryParams.get("documentId");
  const [documentData, setDocumentData] = useState(null);
  const { showError } = useMessage();
  const [pdfFile, setPdfFile] = useState(null);
  const accessToken = getCookie("accessToken");
  const getDocumentDetails = async () => {
    try {
      let localDocumentId;
      if (viewerAccessToken) {
        const responseDocumentViewer = await getViewerDocumentId(
          viewerAccessToken
        );
        if (responseDocumentViewer.status === 200) {
          localDocumentId = responseDocumentViewer.data;
        }
      } else if (documentId) {
        localDocumentId = documentId;
      }

      if (localDocumentId) {
        const responseDocument = await getDocumentByIdAndUserId(
          localDocumentId
        );
        console.log("responseDocument", responseDocument);
        if (responseDocument.status === 200) {
          setDocumentData(responseDocument.data);
          /***This api for get file */
          const response = await axios.get(
            // "https://api.files.clikkle.com/file/private/" + fileId,
            env("BACKEND_SERVER") +
              "/document/file/private/" +
              responseDocument.data.fileId,
            {
              responseType: "arraybuffer",
              headers: {
                Authorization: "Bearer " + accessToken,
              },
              withCredentials: false,
            }
          );
          if (response.status === 200) {
            const blob = new Blob([response.data], {
              type: "application/pdf",
            });
            const url = URL.createObjectURL(blob);
            setPdfFile(url);
          }
        }
      } else {
        showError("Error fetching data");
      }
    } catch (error) {
      showError("Error fetching data:", error);
    }
  };
  /* eslint-disable */
  useEffect(() => {
    getDocumentDetails();
  }, [viewerAccessToken, documentId]);
  /* eslint-enable */

  return (
    <>
      <Box sx={{ flexGrow: 1, mt: 2 }}>
        {pdfFile && documentData && (
          <Grid item xs={12} sm={12}>
            <PreviewAndSign
              pdfFile={pdfFile}
              documentData={documentData}
              onlyPreviewDocument={true}
              handleCloseFunc={() => {}}
            ></PreviewAndSign>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default PreviewDocuments;
