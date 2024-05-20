import { Box, Button, Card, Modal } from "@mui/material";
import React from "react";
import HeadingAndCloseModal from "../Common/HeadingAndCloseModal";
import ModalDescription from "../Common/ModalDescription";
import { revertDocuments } from "../../pages/document/Functions/document";
import { useMessage } from "../Header/Header";
import { useNavigate } from "react-router-dom";

const EditAndResend = ({
  open,
  modalClose,
  documentRowId,
  handleSuccess,
  fileId,
}) => {
  const { showError, showSuccess } = useMessage();
  const navigate = useNavigate();
  /**Document revert functions**/
  const revertToDraftHandller = async () => {
    const response = await revertDocuments(documentRowId);
    if (response.status === 200) {
      navigate(`/documents/draft?documentId=${documentRowId}&fileId=${fileId}`);
      showSuccess("Documents revert successfully !");
      handleSuccess();
    } else {
      showError("Documents revert failed !");
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
              heading={"Edit & Resend document"}
              modalClose={modalClose}
            />
            <ModalDescription
              description={
                "The document would be reverted to draft first, you could edit and resend it then.Are you sure you want to revert that document to draft?"
              }
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button variant="text" onClick={revertToDraftHandller}>
                Revert to Draft
              </Button>
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

export default EditAndResend;
