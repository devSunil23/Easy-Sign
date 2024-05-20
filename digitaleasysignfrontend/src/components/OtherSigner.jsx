import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { env } from "../utilities/function";
import { useMessage } from "./Header/Header";
import { Box, Grid } from "@mui/material";
import PreviewAndSign from "./PreviewAndSign";
import { getCookie } from "../utilities/cookies";
import { documentStatusUpdateRecieved } from "../pages/document/Functions/document";
const OtherSigner = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const signerAccessToken = queryParams.get("signerAccessToken");
  const { showError } = useMessage();
  const [documentData, setDocumentData] = useState(null);
  const [otherSignerEmail, setOtherSignerEmail] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [userEmail, setUserEmail] = useState(undefined);
  const userId = getCookie("userId");
  const getDocumentDetails = async () => {
    try {
      const response = await axios.post(
        env("BACKEND_SERVER") + "/document/othersignerDocuments",
        {
          signerAccessToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
        }
      );
      if (response.status === 200) {
        setDocumentData(response.data.data.responseocumentDetails);
        setOtherSignerEmail(response.data.data.singerEmail);
        setUserEmail(response.data.data.userEmail);
        // const accessToken = getCookie("accessToken");
        const responseFile = await axios.get(
          env("BACKEND_SERVER") +
            "/document/file/private/" +
            response.data.data.responseocumentDetails.fileId,
          {
            responseType: "arraybuffer",
            // headers: {
            //   Authorization: "Bearer " + accessToken,
            // },
            // withCredentials: false,
          }
        );
        const blob = new Blob([responseFile.data], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);
        setPdfFile(url);
        // Update the rows state with API data
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showError("Error fetching data");
    }
  };

  /* eslint-disable */
  useEffect(() => {
    if (signerAccessToken) {
      getDocumentDetails();
    }
  }, [signerAccessToken]);
  /* eslint-enable */

  const statusUpdateFunction = async (documentId, userId, accessToken) => {
    const response = await documentStatusUpdateRecieved(
      documentId,
      userId,
      accessToken
    );
    if (response.status !== 200) {
      showError("Somenthing went wrong");
    }
  };
  /* eslint-disable */
  useEffect(() => {
    if (userId && documentData) {
      console.log(documentData, userId);
      statusUpdateFunction(documentData._id, userId);
      // ();
    }
  }, [userId, documentData]);
  /* eslint-enable */
  return (
    <>
      <Box sx={{ flexGrow: 1, mt: 2 }}>
        {pdfFile && documentData && (
          <Grid item xs={12} sm={12}>
            <PreviewAndSign
              pdfFile={pdfFile}
              documentData={documentData}
              otherSignerEmail={otherSignerEmail}
              userEmail={userEmail}
              handleCloseFunc={() => {}}
            ></PreviewAndSign>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default OtherSigner;
