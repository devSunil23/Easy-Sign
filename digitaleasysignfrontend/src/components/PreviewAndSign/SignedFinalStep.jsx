import React, { useState, useEffect } from "react";
//css import
import "../../style/signedFinalStep.css";
import {
  Button,
  Grid,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { env } from "../../utilities/function";
import { useMessage } from "../Header/Header";
import { getCookie } from "../../utilities/cookies";
import axios from "axios";
import { useUser } from "../../hooks/Authorize";
import { getDocumentByIdAndUserId } from "../../pages/document/Functions/document";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: theme.spacing(2),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  viewer: {
    width: "100%",
    height: "calc(100vh - 120px)", // Adjust to your preferred height
    maxWidth: "fit-content",
  },
  controls: {
    margin: theme.spacing(2, 0),
  },
  button: {
    margin: theme.spacing(1),
  },
  dropzone: {
    width: "100%",
    border: "2px dashed #ccc",
    padding: theme.spacing(4),
    height: "100px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#e3ffea",
  },
  dropzoneActive: {
    border: "1px dashed #007bff",
  },
  div1: {
    width: "350px",
    height: "70px",
    padding: "10px",
    border: "1px solid #aaaaaa",
  },
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  borderNext: {
    display: "flex",
    "border-right": "1px solid #d2dde3",
    "margin-right": "25px",
    "padding-right": "25px",
  },
}));
const SignedFinalStep = ({
  pdfFile,
  handleClose,
  signedType,
  documentData,
  otherSignerEmail,
  userEmail,
}) => {
  const user = useUser();
  const classes = useStyles();
  const { showError, showSuccess } = useMessage();
  const [documentInformation, setDocumentInformation] = useState({
    documentTitle: pdfFile?.name,
    optionalMessage: "",
  });
  const { documentTitle, optionalMessage } = documentInformation;
  const [documentDetails, setDocumentDetails] = useState(undefined);
  const documentId = getCookie("documentId");
  const onChangeHandller = (e) => {
    setDocumentInformation({
      ...documentInformation,
      [e.target.name]: e.target.value,
    });
  };

  /**get document details use documentId */
  const getDocumentDetails = async (documentId) => {
    try {
      const responseDocument = await getDocumentByIdAndUserId(documentId);
      if (responseDocument.status === 200) {
        setDocumentDetails(responseDocument.data);
        setDocumentInformation({
          ...documentInformation,
          documentTitle: responseDocument.data.fileName,
        });
      } else {
        showError("Error fetching documents");
      }
    } catch (error) {
      showError(error);
    }
  };
  /* eslint-disable */
  useEffect(() => {
    if (documentId) {
      getDocumentDetails(documentId);
    }
  }, [documentId]);
  /* eslint-enable */
  /**This is for sent email user */
  const signADocumentHandller = async () => {
    try {
      let data = {
        userEmail: "sunilkumarbais25@gmail.com" || user.email || userEmail,
        documentTitle: documentTitle,
        optionalMessage: optionalMessage,
        documentDetails: documentDetails,
        otherSignerEmail: otherSignerEmail,
      };

      const responseAddDocument = await axios.post(
        env("BACKEND_SERVER") + "/document/sendMail",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
        }
      );

      if (responseAddDocument.data.status === 200) {
        showSuccess("Document Signed successfully!");
        handleClose();
      } else {
        showError("Error while Signed");
      }
    } catch (error) {
      showError("Error while Signed");
    }
  };

  return (
    <div className="mainDivSignedFinalStep">
      <Grid container lg={6} sm={12} xs={12} spacing={1}>
        <Grid item xs={12} sm={6} lg={12}>
          <Typography variant="h6">Final Step</Typography>
        </Grid>
        <Grid item xs={12} sm={6} lg={12} className="styleSingeDocument">
          <Typography variant="subtitle1">Document title</Typography>
          <TextField
            variant="outlined"
            fullWidth
            id="documentTitle"
            style={{ color: "black" }}
            name="documentTitle"
            label="Document Title"
            defaultValue={documentTitle}
            value={documentTitle}
            onChange={onChangeHandller}
            placeholder={documentTitle}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={12} className="styleSingeDocument">
          <Typography variant="subtitle1">Optional Message</Typography>
          <TextareaAutosize
            aria-label="optional message"
            name="optionalMessage"
            onChange={onChangeHandller}
            value={optionalMessage}
            minRows={5} // Minimum number of rows
            placeholder="Add optional message for document signers"
            style={{ width: "100%" }} // Set the width as needed
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={12} className="styleSingeDocument">
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={signADocumentHandller}
            // onClick={updatedPdf ? signADocumentHandller : onSubmitButton}
            style={{
              "border-radius": "8px",
              width: "50%",
            }}
          >
            Sign a Document
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SignedFinalStep;
