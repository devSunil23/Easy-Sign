import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Modal,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import CreateFolder from "./CreateFolder";
import { getFolders, movedDocumentToFolder } from "../../functions/folder";
import { useMessage } from "../Header/Header";
import styles from "../../style/folder.module.css";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HeadingAndCloseModal from "../Common/HeadingAndCloseModal";
import ModalDescription from "../Common/ModalDescription";
const MovedToFolder = ({ open, handleClose, handleSuccess, documentId }) => {
  const [isSmallCloseModal, setIsSmallCloseModal] = useState(false);
  const [breadCrumbList, setBreadrcumbList] = useState([
    { name: "Documents", _id: null },
  ]);
  const [selectedItem, setSelectedItem] = useState({ name: "", id: "parents" });
  const [folders, setFolders] = useState([]);
  const { showError, showSuccess } = useMessage();
  const modalClose = () => {
    setSelectedItem({ name: "", id: "parents" });
    setBreadrcumbList([{ name: "Documents", _id: "parents" }]);
    handleClose();
  };
  const getFolderFunc = async (_id, name) => {
    try {
      const response = await getFolders("Folder", documentId, _id);
      if (response.status === 200) {
        setFolders(response.data);
        // Check if _id already exists in the breadCrumbList
        const isIdExist = breadCrumbList.some((item) => item._id === _id);
        if (!isIdExist) {
          // If _id does not exist, append it to the breadCrumbList
          setBreadrcumbList((prevList) => [...prevList, { name, _id }]);
        }
      } else {
        showError("Error fetching folders");
      }
    } catch (e) {
      showError("Error fetching folders");
    }
  };
  const onDoubleClickHandller = (_id, name) => {
    setSelectedItem({ ...selectedItem, id: _id, name: name });
    getFolderFunc(_id, name);
  };
  /**on click breadcrumb handller */
  const onClickBreadCrumbHandller = (_id, name) => {
    getFolderFunc(_id, name);
    setSelectedItem({ ...selectedItem, id: _id, name: name });
    // Find the index of the item with the provided _id
    const indexToRemove = breadCrumbList.findIndex((item) => item._id === _id);

    if (indexToRemove !== -1) {
      // If the item with the _id is found, remove all items to the right of that index
      setBreadrcumbList((prevList) => prevList.slice(0, indexToRemove + 1));
    }
  };
  const handleCloseSmallModal = () => {
    setIsSmallCloseModal(false);
  };
  const handleOpenCreateModal = () => {
    setIsSmallCloseModal(true);
  };
  const movedToFolder = async (documentId) => {
    try {
      const response = await movedDocumentToFolder(documentId, selectedItem.id);
      if (response.status === 200) {
        showSuccess("Document moved successfully!");
        setSelectedItem({ name: "", id: "parents" });
        setBreadrcumbList([{ name: "Documents", _id: "parents" }]);
        handleSuccess();
      } else {
        showError("Document moved failed.");
      }
    } catch (error) {
      showError("Document moved failed.");
    }
  };
  /**This is function fetching folders */
  const fetchFolders = async () => {
    try {
      const response = await getFolders("Folder", documentId, selectedItem.id);
      if (response.status === 200) {
        setFolders(response.data);
        setIsSmallCloseModal(false);
      } else {
        showError("Error fetching folders");
      }
    } catch (e) {
      showError("Error fetching folders");
    }
  };

  const onSingleClicHandller = (id, name) => {
    // Toggle the selected state of the item
    if (selectedItem.id === id) {
      // If the same item is clicked again, deselect it
      setSelectedItem({ ...selectedItem, id: "parents" });
    } else {
      // Otherwise, select the clicked item
      setSelectedItem({ ...selectedItem, id: id });
    }
  };
  const isSelected = (id) => {
    // Check if the item at the given id is selected
    return selectedItem.id === id;
  };

  /* eslint-disable */
  useEffect(() => {
    if (open) {
      fetchFolders();
    }
  }, [open]);
  /* eslint-enable */
  return (
    <>
      <Modal
        open={open}
        onClose={modalClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <>
          <Card
            sx={{
              boxShadow: "rgba(0, 0, 0, 0.45) 0px 25px 20px -20px",
              borderRadius: "8px",
              maxWidth: "649px",
              width: "100%",
              p: 3,
              m: 2,
              mt: 8,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <HeadingAndCloseModal
              heading={"Move to folder"}
              modalClose={modalClose}
            />
            <ModalDescription
              description={
                "Warning: if the creator of a folder doesn't have permissions to the folder you are moving it to, he will get permissions to that folder. If you want the creator to not have access to it, you can change the creator's permissions to the folder you are moving before moving it."
              }
            />
            <hr />
            <Box minHeight={200}>
              <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
              >
                {breadCrumbList?.map((item, index) => {
                  return (
                    <Button
                      variant="text"
                      key={index}
                      onClick={() =>
                        onClickBreadCrumbHandller(item._id, item.name)
                      }
                    >
                      {item.name}{" "}
                    </Button>
                  );
                })}
              </Breadcrumbs>

              {folders?.map((item, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className={`${styles.folderModule} ${
                        isSelected(item._id) ? styles.selectedFolder : ""
                      }`}
                      onDoubleClick={() =>
                        onDoubleClickHandller(item._id, item.fileName)
                      }
                      onClick={() =>
                        onSingleClicHandller(item._id, item.fileName)
                      }
                    >
                      <FolderIcon
                        className={`${styles.folderIcon} ${
                          isSelected(item._id) ? styles.selectedFolderIcon : ""
                        }`}
                      />
                      <Typography
                        variant="body"
                        style={{ marginLeft: "5px" }}
                        color="text.secondary"
                        className={`${styles.fileName} ${
                          isSelected(item._id) ? styles.selectedFileName : ""
                        }`}
                      >
                        {item.fileName}
                      </Typography>
                    </div>
                    <hr />
                  </>
                );
              })}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button variant="text" onClick={handleOpenCreateModal}>
                Create folder
                <FolderIcon
                  style={{ fontSize: 20, color: "#3B84D9", marginLeft: "5px" }}
                />
              </Button>
              <Button
                variant="contained"
                onClick={() => movedToFolder(documentId)}
                disabled={selectedItem?.id === "parents"}
              >
                Move to folder
              </Button>
            </Box>
          </Card>
        </>
      </Modal>
      <CreateFolder
        open={isSmallCloseModal}
        handleClose={handleCloseSmallModal}
        handleSuccess={fetchFolders}
        folderId={selectedItem.id}
      />
    </>
  );
};

export default MovedToFolder;
