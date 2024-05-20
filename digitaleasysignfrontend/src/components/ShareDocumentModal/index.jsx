import { Button, Card, Modal, Typography } from "@mui/material";
import React from "react";
import HeadingAndCloseModal from "../Common/HeadingAndCloseModal";
import ModalDescription from "../Common/ModalDescription";
import AddViewer from "../Viewer/AddViewer";
import ShareDocumentView from "./ShareDocumentView";
import styles from "../../style/shareModal.module.css";
import { useSelector } from "react-redux";
import { sendViewer } from "../../pages/document/Functions/document";
import { useMessage } from "../Header/Header";
import { useUser } from "../../hooks/Authorize";
const Index = ({ open, modalClose, documentId, handleSuccess }) => {
  const { showError, showSuccess } = useMessage();
  const user = useUser();
  /**Viewer emails */
  const viewerEmails = useSelector(
    (state) => state.viewerAddReducer.viewerEmails
  );
  /**This is for document send for view */
  const shareDocumentHandller = async () => {
    try {
      const response = await sendViewer(
        viewerEmails,
        documentId,
        user.email,
        user.fullName
      );
      if (response.status === 200) {
        showSuccess("Sent email for view successfully!");
        handleSuccess();
      } else {
        showError("Sending email failed");
      }
    } catch (error) {
      showError("Internal Server Error.");
    }
  };

  const hostUrl = window.location.origin;
  const shareUrl = `${hostUrl}/documents/preview?documentId=${documentId}`;
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
            heading={"Share this Document"}
            modalClose={modalClose}
          />
          <ModalDescription
            description={
              "Share this document with additional viewers to allow them to download the signed document."
            }
          />
          <hr />
          <AddViewer />
          <div className={styles.textCenterOr}>
            <Typography variant="text" color="text.secondary">
              OR
            </Typography>
          </div>
          <ShareDocumentView value={shareUrl} />
          <div className={styles.textCenterOr}>
            <Button
              aria-describedby={"share"}
              variant="contained"
              disabled={viewerEmails?.length === 0}
              onClick={shareDocumentHandller}
            >
              Share Document
            </Button>
          </div>
        </Card>
      </Modal>
    </>
  );
};

export default Index;
