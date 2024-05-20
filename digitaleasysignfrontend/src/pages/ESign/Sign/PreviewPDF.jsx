import React, { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useDropzone } from "react-dropzone";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Card, Tooltip, Typography } from "@mui/material";
import PreviewAndSign from "../../../components/PreviewAndSign";
import { useMessage } from "../../../components/Header/Header";
import { getCookie, setCookie } from "../../../utilities/cookies";
import axios from "axios";

import googleDrive from "../../../style/googleDrive.svg";
import dropBox from "../../../style/dropBox.svg";
import oneDrive from "../../../style/oneDrive.svg";
import box from "../../../style/box.svg";
import Button from "@mui/material/Button";
import { env } from "../../../utilities/function";
import useDrivePicker from "react-google-drive-picker";
import { useGoogleLogin } from "@react-oauth/google";
import DropboxChooser from "react-dropbox-chooser";
import { useLocation, useNavigate } from "react-router-dom";
import BoxIntegration from "./BoxIntegration";
// Configure PDF.js worker path for the library to work
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "background.paper",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  border: "1px solid #424242",
  color: theme.palette.text.secondary,
}));

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
    border: "1px dashed #424242",
    padding: theme.spacing(4),
    height: "150px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "background.paper",
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
}));

const PreviewPDF = () => {
  const classes = useStyles();
  const [scale, setScale] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);
  const { showError, showSuccess } = useMessage();
  const [openPicker] = useDrivePicker();
  const [authToken, setAuthToken] = useState(undefined);
  const [dropBoxAuthToken, setDropBoxAuthToken] = useState(undefined);
  const [boxAuthToken, setBoxAuthToken] = useState(undefined);
  const [boxPickerOpen, setBoxPickerOpen] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");
  const state = queryParams.get("state");
  const navigate = useNavigate();
  /***import file from one drive */
  const onLoadOneDriveFilePicker = async (files) => {
    // setMicrosoftAuthToken(files.accessToken);
    const dataObject = { id: files.value[0].id, authToken: files.accessToken };
    try {
      const response = await axios.post(
        env("BACKEND_SERVER") + "/document/get-one-drive-file",
        dataObject,
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      handleFileChange(blob);
      // window.push(linkurl);
    } catch (error) {
      console.log("error", error);
    }
  };
  /**dropbox authentication */
  const authCodeFunction = async () => {
    try {
      const response = await axios.post(
        env("BACKEND_SERVER") + "/document/getAuthCodeDropBox",
        {
          code,
          clientId: env("DROPBOX_API_KEY"),
          client_secret: env("DROPBOX_CLIENT_SECRET"),
          redirect_url: env("DROPBOX_REDIRECT_URL"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
        }
      );
      if (response.status === 200) {
        showSuccess("Dropbox Imported Successfully");
        setDropBoxAuthToken(response.data.accessToken);
        navigate("/");
      } else {
        showError("Dropbox import failed.");
      }
    } catch (error) {
      showError("Dropbox import failed.");
    }
  };
  const onBoxFileSelectHandller = async (files) => {
    const { authenticated_download_url, name } = files[0];
    const response = await axios.post(
      env("BACKEND_SERVER") + "/document/get-box-file",
      { authenticated_download_url, name, accessToken: boxAuthToken },
      {
        responseType: "blob",
      }
    );
    const blob = new Blob([response.data], { type: "application/pdf" });
    handleFileChange(blob);
    setBoxPickerOpen(false);
  };
  const handleCancelFile = () => {
    setBoxPickerOpen(false);
  };
  /**BOX authentication */
  const authCodeBoxFunction = async () => {
    try {
      const response = await axios.post(
        env("BACKEND_SERVER") + "/document/getAuthCodeBox",
        {
          code,
          clientId: env("BOX_CLIENT_ID"),
          client_secret: env("BOX_CLIENT_SECRET"),
          redirect_url: env("BOX_REDIRECT_URL"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
        }
      );
      if (response.status === 200) {
        showSuccess("BOX Imported Successfully");
        setBoxAuthToken(response.data.accessToken);
        navigate("/");
      } else {
        showError("BOX import failed.");
      }
    } catch (error) {
      showError("BOX import failed.");
    }
  };
  console.log("boxcode", boxAuthToken);
  /* eslint-disable */
  useEffect(() => {
    // this is for box
    if (state === "2020135264589015" && code) {
      authCodeBoxFunction();
    } //this is for dropbox
    else if (code) {
      authCodeFunction();
    }
  }, [code, state]);
  /* eslint-enable */

  /**One drive */
  const openOneDrivePicker = () => {
    // Configure the file picker
    var odOptions = {
      clientId: env("MICROSOFT_CLIENT_ID"),
      action: "share",
      multiSelect: false,
      advanced: {
        // Add any advanced options here
      },
      success: onLoadOneDriveFilePicker,
      cancel: function () {
        // Handle the cancellation here
        console.log("OneDrive picker canceled.");
      },
      error: function (e) {
        console.log(e);
      },
    };
    // Open the file picker
    window.OneDrive.open(odOptions);
  };
  /**dropbox auth code */

  const dropBoxAuthHandller = () => {
    const authUrl = `https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=${env(
      `DROPBOX_API_KEY`
    )}&redirect_uri=${env(`DROPBOX_REDIRECT_URL`)}`;
    window.location.href = authUrl;
  };

  /**box auth code */
  const boxAuthHandller = () => {
    const authorizationUrl = `https://account.box.com/api/oauth2/authorize?response_type=code&client_id=${env(
      "BOX_CLIENT_ID"
    )}&redirect_uri=${env("BOX_REDIRECT_URL")}&state=2020135264589015`;

    window.location.href = authorizationUrl;
  };
  /**this function handle box-picker open or close */
  const boxPickerOpenAndClose = () => {
    setBoxPickerOpen(true);
  };

  /*drop-box handller */
  const dropBoxChooseFileHandller = async (files) => {
    const { id, name } = files[0];
    const response = await axios.post(
      env("BACKEND_SERVER") + "/document/get-dropbox-file",
      { accessToken: dropBoxAuthToken, id, name },
      {
        responseType: "blob",
      }
    );
    const blob = new Blob([response.data], { type: "application/pdf" });
    handleFileChange(blob);
  };
  /**This is old code for upload pdf its not working */

  // const handleFileChange = async (file) => {
  //   setPdfFile(file);
  //   try {
  //     const accessToken = getCookie("accessToken");
  //     // Create a FormData object to send the file
  //     const formData = new FormData();
  //     formData.append("files", file);
  //     // Make a POST request to your API endpoint
  //     const response = await axios.post(
  //       "https://api.files.clikkle.com/file/private",
  //       formData,
  //       {
  //         headers: {
  //           Authorization: "Bearer " + accessToken,
  //           "Content-Type": "multipart/form-data", // Important for file uploads
  //         },
  //         withCredentials: false,
  //       }
  //     );

  //     if (response.data.success === true) {
  //       let data = {
  //         id: response.data.uploaded[0]._id,
  //         userId: response.data.uploaded[0].userId,
  //         name: response.data.uploaded[0].name,
  //         userName: getCookie("fullName"),
  //         size: response.data.uploaded[0].size,
  //         mimetype: response.data.uploaded[0].mimetype,
  //       };
  //       const responseAddDocument = await axios.post(
  //         env("BACKEND_SERVER") + "/document/addDocument",
  //         data,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           withCredentials: false,
  //         }
  //       );
  //       if (responseAddDocument.data.status === 200) {
  //         setCookie("documentId", responseAddDocument.data.data._id);
  //         showSuccess("File is uploaded successfully!");
  //       }
  //     } else {
  //       showError("Error uploading file");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     showError("Error uploading file");
  //   }
  //   setScale(Math.max(scale - 0.6, 0.6));

  /***import file from pdf */

  const handleFileChange = async (file) => {
    setPdfFile(file);
    try {
      // const accessToken = getCookie("accessToken");
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("files", file);
      // Make a POST request to your API endpoint
      const response = await (
        await axios.post(env("BACKEND_SERVER") + "/document/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ).data;

      if (response?.success === true) {
        let data = {
          id: response.files.id,
          userId: getCookie("userId"),
          name: response.files.filename,
          userName: getCookie("fullName"),
          size: response.files.size,
          mimetype: response.files.mimetype,
        };
        const responseAddDocument = await axios.post(
          env("BACKEND_SERVER") + "/document/addDocument",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: false,
          }
        );

        if (responseAddDocument.data.status === 200) {
          setCookie("documentId", responseAddDocument.data.data._id);
          showSuccess("File is uploaded successfully!");
        }
      } else {
        showError("Error uploading file");
      }
    } catch (error) {
      showError("Error uploading file");
    }
    setScale(Math.max(scale - 0.6, 0.6));
  };

  const selectGoogleDriveFileHandller = async (data) => {
    if (data.action === "cancel") {
      console.log("User clicked cancel/close button");
    }
    if (data.action === "picked") {
      let googleDriveData = data.docs[0];
      const { id } = googleDriveData;
      const dataObject = { id, authToken };
      try {
        const response = await axios.post(
          env("BACKEND_SERVER") + "/document/get-google-drive-file",
          dataObject,
          {
            responseType: "blob",
          }
        );
        const blob = new Blob([response.data], { type: "application/pdf" });
        handleFileChange(blob);
        // window.push(linkurl);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => setAuthToken(tokenResponse.access_token),
    scope: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  /* eslint-disable */
  useEffect(() => {
    if (authToken) {
      showSuccess("Google Drive Imported Successfully !");
    }
  }, [authToken]);
  /* eslint-enable */

  const handleOpenPicker = () => {
    openPicker({
      clientId: env("GOOGLE_CLIENT_ID"),
      developerKey: env("GOOGLE_API_KEY"),
      viewId: "DOCS",
      token: authToken,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false,
      // customViews: customViewsArray, // custom view
      callbackFunction: selectGoogleDriveFileHandller,
    });
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleFileChange(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".pdf",
  });
  /**when close modal this function set null pdf file */
  const onCloseModalHandller = () => {
    setPdfFile(null);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2} alignItems="center">
        {pdfFile && (
          <Grid item xs={12} sm={12}>
            <PreviewAndSign
              handleCloseFunc={onCloseModalHandller}
              pdfFile={pdfFile}
            ></PreviewAndSign>
          </Grid>
        )}
        <Grid
          container
          spacing={2}
          alignItems="center"
          style={{ marginTop: "10px" }}
        >
          <Grid item xs={12} sm={3}></Grid>
          <Grid item xs={12} sm={3}>
            <Typography
              variant="p"
              style={{ fontSize: "14px", fontWeight: "500" }}
            >
              File Uploader
            </Typography>
            <Tooltip title="Drop  Or Upload Files here" arrow placement="left">
              <Card
                {...getRootProps({
                  className: `${classes.dropzone} ${
                    isDragActive ? classes.dropzoneActive : ""
                  }`,
                })}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop files here...</p>
                ) : (
                  <>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Drop files here
                    </p>
                    <p
                      style={{
                        color: "#8698a5",
                        fontSize: "16px",
                        fontWeight: "500",
                      }}
                    >
                      Or
                    </p>
                    <Button
                      variant="outlined"
                      style={{ "border-radius": "10px" }}
                    >
                      Upload File
                    </Button>
                  </>
                )}
              </Card>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography
              variant="p"
              style={{ fontSize: "14px", fontWeight: "500" }}
            >
              Import files from:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Tooltip
                  title="Import file from Google Drive"
                  arrow
                  placement="top"
                >
                  <Item
                    onClick={() => (authToken ? handleOpenPicker() : login())}
                  >
                    <img src={googleDrive} alt="googleDrive Logo" />
                    <br />
                    <Typography
                      variant="p"
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      Google Drive
                    </Typography>
                  </Item>
                </Tooltip>
                {/* )} */}
              </Grid>
              <Grid item xs={6}>
                <Tooltip
                  title="Import file from One Drive"
                  arrow
                  placement="top"
                >
                  <Item onClick={openOneDrivePicker}>
                    <img src={oneDrive} alt="oneDrive Logo" />
                    <br />
                    <Typography
                      variant="p"
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      One Drive
                    </Typography>
                  </Item>
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                {/* <DropboxChooser
                    appKey={env("DROPBOX_API_KEY")}
                    success={dropBoxChooseFileHandller}
                    cancel={() => console.log("cancelled")}
                    multiselect={false}
                    extensions={[".pdf"]}
                  >
                    <Item>
                      <img src={dropBox} alt="dropBox Logo" />
                      <br />
                      <Typography
                        variant="p"
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        Dropbox
                      </Typography>
                    </Item>
                  </DropboxChooser> */}
                {dropBoxAuthToken ? (
                  <Tooltip title="Import file from Dropbox" arrow>
                    <DropboxChooser
                      appKey={env("DROPBOX_API_KEY")}
                      success={dropBoxChooseFileHandller}
                      cancel={() => console.log("cancelled")}
                      multiselect={false}
                      extensions={[".pdf"]}
                    >
                      <Item>
                        <img src={dropBox} alt="dropBox Logo" />
                        <br />
                        <Typography
                          variant="p"
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          Dropbox
                        </Typography>
                      </Item>
                    </DropboxChooser>
                  </Tooltip>
                ) : (
                  <Tooltip title="Import file from Dropbox" arrow>
                    <Item onClick={dropBoxAuthHandller}>
                      <img src={dropBox} alt="dropBox Logo" />
                      <br />
                      <Typography
                        variant="p"
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        Dropbox
                      </Typography>
                    </Item>
                  </Tooltip>
                )}
              </Grid>
              <Grid item xs={6}>
                {boxAuthToken ? (
                  <Item onClick={boxPickerOpenAndClose}>
                    <img src={box} alt="box Logo" />
                    <br />
                    <Typography
                      variant="p"
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      Box
                    </Typography>
                  </Item>
                ) : (
                  <Tooltip title="Import file from box" arrow>
                    <Item onClick={boxAuthHandller}>
                      <img src={box} alt="box Logo" />
                      <br />
                      <Typography
                        variant="p"
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        Box
                      </Typography>
                    </Item>
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={3}></Grid>
        </Grid>
        {/* <Grid container alignItems={'center'}  >
            <Stack alignItems={'center'}>
                  <Button variant="contained">Prepare Doc</Button>
            </Stack>
          </Grid> */}
      </Grid>
      {boxPickerOpen && (
        <BoxIntegration
          boxaccessToken={boxAuthToken}
          handleCancelFile={handleCancelFile}
          onFileSelect={onBoxFileSelectHandller}
        />
      )}
    </div>
  );
};

export default PreviewPDF;
