import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Tooltip, Typography } from "@mui/material";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { getCookie } from "../../utilities/cookies";
import PreviewAndSign from "../../components/PreviewAndSign";
import axios from "axios";
import { useMessage } from "../../components/Header/Header";
import {
  defaultSortModel,
  documentsRenameHandller,
  generateSingingLinkFunc,
  getAllDocuments,
  movedToTrashDocuments,
} from "./Functions/document";
import ShowStatus from "../../components/Common/ShowStatus";
import DateFormate from "../../components/Common/DateFormate";
import StatusBasedSearch from "../../components/Common/StatusBasedSearch";
import SearchDocuments from "../../components/Common/SearchDocuments";
import RangeDatePicker from "../../components/Common/RangeDatePicker";
import {
  awaitingDocumentActivity,
  completedDocumentsActivity,
  draftDocumetsActivity,
  folderOptions,
  recievedDocumentsActivity,
} from "../../services/options";
import DocumentOptions from "../../components/Common/DocumentOptions";
import DocumentRenameTextField from "../../components/Common/DocumentRenameTextField";
import MovedToFolder from "../../components/MoveToFolder/MovedToFolder";
import BreadCrumbTable from "../../components/Common/BreadCrumbTable";
import { downloadFile } from "../../functions/downloadfile";
import { env } from "../../utilities/function";
import { useNavigate } from "react-router-dom";
import ShareDocumentModal from "../../components/ShareDocumentModal";
import EditAndResend from "../../components/EditAndResend";
import SendReminder from "../../components/Reminder/SendReminder";
import GenerateSingingLinkModal from "../../components/GenerateSinginLinkModal";
import { useUser } from "../../hooks/Authorize";
import CreateNewDocument from "../../components/CreateNewDocument";
import useStyles from "./Style";
import Loading from "../../components/Progress/Loading";

const Index = (props) => {
  const classes = useStyles();
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [documentType, setDocumentType] = useState("Folder");
  const [fileName, setFileName] = useState("");
  const [document, setDocument] = React.useState("");
  const [documentRowId, setDocumentRowId] = useState();
  const [documentRow, setDocumentRow] = useState();
  const [iseditableFIleName, setIsEditableFileName] = useState(false);
  const [isOpenshareModal, setIsOpenShareModal] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isSignGenerateLinkModalOpen, setIsGenerateLinkModalOpen] =
    useState(false);
  const [isRevertModalOpen, setIsRevertModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [signDocument] = React.useState(false);
  const user = useUser();
  const [breadrumbData, setBreadCrumbData] = useState([
    {
      name: "Documents",
      _id: null,
    },
  ]);
  const { showError, showSuccess } = useMessage();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 5)),
    endDate: new Date(),
  });
  const { startDate, endDate } = selectedDateRange;
  const getRowId = (row) => row._id;
  const isEmpty = rows?.length === 0 || filteredRows?.length === 0;
  const lastFiveYearDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 5)
  );

  const [isLoading,setIsLoading] = useState(true)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  /**date range picker */
  const onChangeHandleDatepicker = (dateStrings) => {
    if (dateStrings) {
      setSelectedDateRange({
        ...selectedDateRange,
        startDate: dateStrings[0],
        endDate: dateStrings[1],
      });
    } else {
      setSelectedDateRange({
        ...selectedDateRange,
        startDate: new Date(lastFiveYearDate),
        endDate: new Date(),
      });
    }
  };
  /**document rename handller */
  const onDocumentRenameChangeHandller = (e) => {
    const { value } = e.target;
    setFileName(value);
  };
  const fetchData = async (folderId) => {
    try {
      const response = await getAllDocuments(folderId, startDate, endDate);
      if (response.status === 200) {
        setRows(response.data.data); // Update the rows state with API data
        setFilteredRows(response.data.data); // Initialize filteredRows with all rows
        setIsCreateModalOpen(false);
        setIsLoading(false)
      }
    } catch (e) {
      console.log(e);
    }
  };
  /**This is for go to folder innersection */
  const onDoubleClickFOlderHandller = (folderId, name) => {
    // Check if _id already exists in the breadCrumbList
    const isIdExist = breadrumbData.some((item) => item._id === folderId);
    if (!isIdExist) {
      // If _id does not exist, append it to the breadCrumbList
      setBreadCrumbData((prevList) => [...prevList, { name, _id: folderId }]);
    }
    fetchData(folderId);
  };

  /**on click breadcrumb handller */
  const onClickBreadCrumbHandller = (_id) => {
    fetchData(_id);
    // Find the index of the item with the provided _id
    const indexToRemove = breadrumbData.findIndex((item) => item._id === _id);
    if (indexToRemove !== -1) {
      // If the item with the _id is found, remove all items to the right of that index
      setBreadCrumbData((prevList) => prevList.slice(0, indexToRemove + 1));
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const columns = [
    {
      field: "fileName",
      headerName: "TITLE",
      width: 470,
      renderCell: (params) =>
        iseditableFIleName && documentRowId === params.row._id ? (
          <DocumentRenameTextField
            value={fileName}
            onChange={onDocumentRenameChangeHandller}
            onEnterPress={documentsRename}
          />
        ) : (
          <div
            style={{ display: "flex", alignItems: "center" }}
            onDoubleClick={() =>
              params.row.status === "Folder"
                ? onDoubleClickFOlderHandller(
                    params.row._id,
                    params.row.fileName
                  )
                : {}
            }
          >
            <span>{params.row.fileName}</span>
            <ShowStatus
              backgroundColor={
                params.row.status === "Draft"
                  ? "#E6F4FC"
                  : params.row.status === "Awaiting"
                  ? "#FFF2E6"
                  : params.row.status === "Completed"
                  ? "#E3FFEA"
                  : params.row.status === "Folder"
                  ? "#295C97"
                  : params.row.status === "Recieved"
                  ? "#FFF2E6"
                  : "gray"
              }
              color={
                params.row.status === "Draft"
                  ? "#7D8D98"
                  : params.row.status === "Awaiting"
                  ? "#F18653"
                  : params.row.status === "Completed"
                  ? "#4BC97E"
                  : params.row.status === "Folder"
                  ? "white"
                  : params.row.status === "Recieved"
                  ? "#F18653"
                  : "gray"
              }
              status={
                params.row.status === "Recieved"
                  ? "AWAITING YOU"
                  : params.row.status
              }
            />
          </div>
        ),
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 150,
      renderCell: (params) => (
        <DateFormate localFormate={params.row.createdAt} />
      ),
    },
    {
      field: "userName",
      headerName: "Created By",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: "auto",
      renderCell: () => (
        <div>
          <Tooltip title="click to see all options">
            <Button
              aria-describedby={id}
              variant="contained"
              onClick={handleClick}
            >
              Options
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleChange = (event) => {
    setDocument(event.target.value);
  };
  /**This function for onchange search */
  const onChangeSearchHandller = (event) => {
    const { value } = event.target;
    // Filter rows based on the search input
    const filteredData = rows.filter((row) =>
      row.fileName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredRows(filteredData);
  };

  const fetchFile = async (fileId) => {
    const accessToken = getCookie("accessToken");
    try {
      const response = await axios.get(
        // "https://api.files.clikkle.com/file/private/" + fileId,
        env("BACKEND_SERVER") + "/document/file/private/" + fileId,
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  /**This is for document update status for Deleted */
  const onClickDocumentDeleteHandller = async () => {
    const responseMessage = await movedToTrashDocuments(documentRowId);
    if (responseMessage.status === 200) {
      showSuccess(responseMessage.message);
      fetchData();
      setAnchorEl(null);
      setDocumentRowId(null);
    } else {
      showError(responseMessage.message);
    }
  };
  /**This function for document rename */
  const documentsRename = async () => {
    const responseMessage = await documentsRenameHandller(
      documentRowId,
      fileName
    );
    if (responseMessage.status === 200) {
      showSuccess(responseMessage.message);
      fetchData();
      setAnchorEl(null);
      setDocumentRowId(null);
      setIsEditableFileName(false);
    } else {
      showError(responseMessage.message);
    }
  };

  const documentFileRenameHandlller = () => {
    setIsEditableFileName(true);
    setAnchorEl(null);
  };
  /**This function for folder move to */
  const moveToFolder = () => {
    setIsCreateModalOpen(true);
    setAnchorEl(null);
  };

  /**download file */
  const downloadDocumentHandller = () => {
    ///download
    downloadFile(pdfFile, fileName);
  };

  /**This is for sendreminder handller */
  const sendReminderHandller = () => {
    setIsReminderModalOpen(true);
    setAnchorEl(null);
  };

  /**This function for open genrate sining link modal */
  const onClickGnerateSignLinkHandller = () => {
    setIsGenerateLinkModalOpen(true);
    setAnchorEl(null);
  };

  //This is for sign handller
  const signHandller = async () => {
    const response = await generateSingingLinkFunc(documentRow, user.email);
    if (response.status === 200) {
      try {
        const signingLink = `${window.location.origin}/otherSinger?signerAccessToken=${response.data.signerAccessToken}`;
        window.location.href = signingLink;
      } catch (err) {
        showError("Failed to generate signing link");
      }
    }
  };

  /**document preview */
  const documentPreviewHandller = () => {
    navigate(`/documents/preview?documentId=${documentRowId}`);
  };

  /***document preview activity */
  const onClickActivityHandller = () => {
    navigate(
      `/documents/preview?documentId=${documentRowId}&activities=${true}`
    );
  };

  /***This function is open modal edit and resend */
  const editAndResendHandller = () => {
    setIsRevertModalOpen(true);
    setAnchorEl(null);
  };

  /**This function id open modal for sharedocument */
  const shareDocumentHandller = () => {
    setIsOpenShareModal(true);
    setAnchorEl(null);
  };

  /**This is function for modal close */
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setIsOpenShareModal(false);
    setIsRevertModalOpen(false);
    setIsReminderModalOpen(false);
    setIsGenerateLinkModalOpen(false);
  };
  /* eslint-disable */
  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, [selectedDateRange]);
  /* eslint-enable */

  return (
    <>
     {isLoading && <Loading/>}
    
      <Box sx={{ flexGrow: 1, mt: 2 }}>
        {signDocument && (
          <Grid item xs={12} sm={12}>
            <PreviewAndSign
              pdfFile={pdfFile}
              handleCloseFunc={() => {}}
            ></PreviewAndSign>
          </Grid>
        )}
        <Typography variant="h6">Documents</Typography>
        <br />
        <p style={{ color: "#7d8d98" }}>
          Browse all past, active and draft documents uploaded to your Clikkle
          account.
        </p>
        <br />

        <Grid container spacing={1}>
          <Grid item xs={12} md={2}>
            <Tooltip
              title="Select the documents by signers & Creators"
              arrow
              placement="top"
            >
              <FormControl
                sx={{ m: 1, minWidth: 150 }}
                size="small"
                style={{ marginTop: "16px" }}
              >
                <InputLabel id="demo-select-small-label">Documents</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={document}
                  label="Documents"
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>Documents</em>
                  </MenuItem>
                  <MenuItem value={"Signers"}>Signers</MenuItem>
                  <MenuItem value={"Creators"}>Creators</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
          <SearchDocuments onChangeSearchHandller={onChangeSearchHandller} />
          <StatusBasedSearch defaultStatus={`/documents`} />
          <RangeDatePicker handleDateChange={onChangeHandleDatepicker} />
        </Grid>
        {breadrumbData?.length > 1 ? (
          <BreadCrumbTable
            breadCrumbData={breadrumbData}
            onClick={onClickBreadCrumbHandller}
          />
        ) : (
          ""
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} sx={{ marginTop: "25px" }}>
            <div className={classes.root}>
              {isEmpty ? (
                <CreateNewDocument />
              ) : (
                <DataGrid
                  rows={filteredRows}
                  columns={columns}
                  getRowId={getRowId}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  sortModel={defaultSortModel}
                  disableSelectionOnClick
                  disableColumnReorder={true}
                  onRowClick={(params) => {
                    setDocumentRowId(params.row._id);
                    setDocumentRow(params.row);
                    setDocumentType(params.row.status);
                    if (params.row.fileId) {
                      setFileName(params.row.fileName);
                      fetchFile(params.row.fileId); // Pass _id to fetchFile
                    }
                  }}
                />
              )}
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                PaperProps={{
                  style: {
                    width: "15%", // Set the desired width here
                  },
                }}
              >
                <Stack direction="column" spacing={3}>
                  <FormControl id="buttonsID">
                    {(documentType === "Folder"
                      ? folderOptions
                      : documentType === "Completed"
                      ? completedDocumentsActivity
                      : documentType === "Awaiting"
                      ? awaitingDocumentActivity
                      : documentType === "Draft"
                      ? draftDocumetsActivity
                      : documentType === "Recieved"
                      ? recievedDocumentsActivity
                      : []
                    )?.map((item, index) => {
                      return (
                        <DocumentOptions
                          id={item.id}
                          name={item.name}
                          src={item.src}
                          onClick={
                            item.id === "delete"
                              ? onClickDocumentDeleteHandller
                              : item.id === "rename"
                              ? documentFileRenameHandlller
                              : item.id === "moveto"
                              ? moveToFolder
                              : item.id === "download"
                              ? downloadDocumentHandller
                              : item.id === "preview"
                              ? documentPreviewHandller
                              : item.id === "share"
                              ? shareDocumentHandller
                              : item.id === "activity"
                              ? onClickActivityHandller
                              : item.id === "editandresend"
                              ? editAndResendHandller
                              : item.id === "sendreminder"
                              ? sendReminderHandller
                              : item.id === "generatesignlink"
                              ? onClickGnerateSignLinkHandller
                              : item.id === "sign"
                              ? signHandller
                              : () => {}
                          }
                          key={index}
                        />
                      );
                    })}
                  </FormControl>
                </Stack>
              </Popover>
            </div>
          </Grid>
        </Grid>
        <MovedToFolder
          open={isCreateModalOpen}
          handleClose={handleCloseModal}
          documentId={documentRowId}
          handleSuccess={fetchData}
        />
        <ShareDocumentModal
          open={isOpenshareModal}
          modalClose={handleCloseModal}
          documentId={documentRowId}
          handleSuccess={() => setIsOpenShareModal(false)}
        />
        <EditAndResend
          open={isRevertModalOpen}
          modalClose={handleCloseModal}
          documentRowId={documentRowId}
          handleSuccess={fetchData}
          fileId={documentRow?.fileId}
        />
        <SendReminder
          modalClose={handleCloseModal}
          open={isReminderModalOpen}
          documentId={documentRowId}
        />
        <GenerateSingingLinkModal
          documentId={documentRowId}
          open={isSignGenerateLinkModalOpen}
          modalClose={handleCloseModal}
        />
      </Box>
    </>
  );
};

export default Index;
