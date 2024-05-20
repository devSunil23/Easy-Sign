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
import { getCookie } from "../../../utilities/cookies";
import PreviewAndSign from "../../../components/PreviewAndSign";
import axios from "axios";
import { useMessage } from "../../../components/Header/Header";
import {
  defaultSortModel,
  documentsRenameHandller,
  getDocumentsByStatus,
  movedToTrashDocuments,
} from "../Functions/document";
import ShowStatus from "../../../components/Common/ShowStatus";
import DateFormate from "../../../components/Common/DateFormate";
import StatusBasedSearch from "../../../components/Common/StatusBasedSearch";
import SearchDocuments from "../../../components/Common/SearchDocuments";
import RangeDatePicker from "../../../components/Common/RangeDatePicker";
import {
  completedDocumentsActivity,
  folderOptions,
} from "../../../services/options";
import DocumentOptions from "../../../components/Common/DocumentOptions";
import { downloadFile } from "../../../functions/downloadfile";
import { env } from "../../../utilities/function";
import { useNavigate } from "react-router-dom";
import MovedToFolder from "../../../components/MoveToFolder/MovedToFolder";
import BreadCrumbTable from "../../../components/Common/BreadCrumbTable";
import ShareDocumentModal from "../../../components/ShareDocumentModal";
import DocumentRenameTextField from "../../../components/Common/DocumentRenameTextField";
import CreateNewDocument from "../../../components/CreateNewDocument";
import useStyles from "../Style";
import Loading from "../../../components/Progress/Loading";

const Index = (props) => {
  const classes = useStyles();
  const [isLoading,setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [document, setDocument] = React.useState("");
  const [documentRowId, setDocumentRowId] = useState();
  const [iseditableFIleName, setIsEditableFileName] = useState(false);
  const [breadrumbData, setBreadCrumbData] = useState([
    {
      name: "Documents",
      _id: null,
    },
  ]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOpenshareModal, setIsOpenShareModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [filteredRows, setFilteredRows] = useState([]);
  const [documentType, setDocumentType] = useState("Folder");
  const [fileName, setFileName] = useState(undefined);
  const [signDocument] = React.useState(false);
  const { showError, showSuccess } = useMessage();
  const lastFiveYearDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 5)
  );
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: lastFiveYearDate,
    endDate: new Date(),
  });
  const { startDate, endDate } = selectedDateRange;
  const getRowId = (row) => row._id;
  const isEmpty = rows?.length === 0 || filteredRows?.length === 0;
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /**download file */
  const downloadDocumentHandller = () => {
    ///download
    downloadFile(pdfFile, fileName);
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

  /**document rename handller */
  const onDocumentRenameChangeHandller = (e) => {
    const { value } = e.target;
    setFileName(value);
  };

  // file rename handller
  const documentFileRenameHandlller = () => {
    setIsEditableFileName(true);
    setAnchorEl(null);
  };

  /**This function id open modal for sharedocument */
  const shareDocumentHandller = () => {
    setIsOpenShareModal(true);
    setAnchorEl(null);
  };
  /**This function for folder move to */
  const moveToFolder = () => {
    setIsCreateModalOpen(true);
    setAnchorEl(null);
  };
  /**This is function for modal close */
  const handleCloseModal = () => {
    setIsOpenShareModal(false);
    setIsCreateModalOpen(false);
  };
  const open = Boolean(anchorEl);
  const fetchData = async (folderId) => {
    const response = await getDocumentsByStatus(
      "Completed",
      startDate,
      endDate,
      folderId
    );
    if (response.status === 200) {
      setRows(response.data); // Update the rows state with API data
      setFilteredRows(response.data);
      setIsLoading(false)
      setIsCreateModalOpen(false);
    } else {
      showError(response.data);
    }
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
                params.row.status === "Completed" ? "#E3FFEA" : "#295C97"
              }
              color={params.row.status === "Completed" ? "#4BC97E" : "white"}
              status={params.row.status}
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
          <Tooltip title="click to see all Options">
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

  /**This is for document update status for Deleted */
  const onClickDocumentDeleteHandller = async () => {
    const responseMessage = await movedToTrashDocuments(documentRowId);
    if (responseMessage.status === 200) {
      showSuccess(responseMessage.message);
      fetchData();
      setAnchorEl(null);
    } else {
      showError(responseMessage.message);
    }
  };
  /* eslint-disable */
  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, [selectedDateRange]);
  /* eslint-enable */
  return (
    <Box sx={{ flexGrow: 1, mt: 2 }}>
      {isLoading && <Loading/>}
      {signDocument && (
        <Grid item xs={12} sm={12}>
          <PreviewAndSign
            handleCloseFunc={() => {}}
            pdfFile={pdfFile}
          ></PreviewAndSign>
        </Grid>
      )}
      <Typography variant="h6"> Completed Documents</Typography>
      <br />
      <p style={{ color: "#7d8d98" }}>
        Browse all past, active and draft documents uploaded to your Clikkle
        account.
      </p>
      <br />
      <Grid
        container
        spacing={1}
        justifyContent={"center"}
        textAlign={"center"}
      >
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
        <StatusBasedSearch defaultStatus={`/documents/completed`} />
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
                disableSelectionOnClick
                disableColumnReorder={true}
                sortModel={defaultSortModel}
                onRowClick={(params) => {
                  setDocumentRowId(params.row._id);
                  setDocumentType(params.row.status);
                  setFileName(params.row.fileName);
                  if (params.row.fileId) {
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
                    : []
                  )?.map((item, index) => {
                    return (
                      <DocumentOptions
                        id={item.id}
                        name={item.name}
                        src={item.src}
                        onClick={
                          item.id === "download"
                            ? downloadDocumentHandller
                            : item.id === "preview"
                            ? documentPreviewHandller
                            : item.id === "moveto"
                            ? moveToFolder
                            : item.id === "share"
                            ? shareDocumentHandller
                            : item.id === "delete"
                            ? onClickDocumentDeleteHandller
                            : item.id === "activity"
                            ? onClickActivityHandller
                            : item.id === "rename"
                            ? documentFileRenameHandlller
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
    </Box>
  );
};

export default Index;
