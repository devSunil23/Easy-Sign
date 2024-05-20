import { Box, Button, Card, Modal } from "@mui/material";
import React from "react";
import HeadingAndCloseModal from "../Common/HeadingAndCloseModal";
import ModalDescription from "../Common/ModalDescription";
import EmptyTrash from ".";
import { emptyTrashHandller } from "../../pages/document/Functions/document";
import { useMessage } from "../Header/Header";
const EmptyTrashModal = ({ open, modalClose, handleSuccess }) => {
  const { showSuccess, showError } = useMessage();
  //delete all trash documents
  const onClickEmptyTrashHandller = async () => {
    const response = await emptyTrashHandller();
    if (response.status === 200) {
      showSuccess("Clear Trash successfully !");
      handleSuccess();
    } else {
      showError(response.message);
    }
  };
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
              heading={"Confirm Trash Emptying"}
              modalClose={modalClose}
            />
            <ModalDescription
              description={
                "Are you certain you wish to empty the trash? Doing so will permanently erase all items from your account, and this action is irreversible."
              }
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <EmptyTrash
                style={{ backgroundColor: "red", color: "white" }}
                onClickHandller={onClickEmptyTrashHandller}
              />
              <Button variant="contained" onClick={modalClose}>
                Cancel
              </Button>
            </Box>
          </Card>
        </>
      </Modal>
    </>
  );
};

export default EmptyTrashModal;
