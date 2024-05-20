import { Box, Card, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import HeadingAndCloseModal from "../Common/HeadingAndCloseModal";
import ModalDescription from "../Common/ModalDescription";
import UserEmails from "./UserEmails";
import ModalFooter from "../Common/ModalFooter";
import {
  getDocumentByIdAndUserId,
  sendReminderForSign,
} from "../../pages/document/Functions/document";
import { useUser } from "../../hooks/Authorize";
import { useMessage } from "../Header/Header";
const SendReminder = ({ open, modalClose, documentId }) => {
  const [documentData, setDocumentData] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const { showError, showSuccess } = useMessage();
  const user = useUser();
  const fetchDocument = async (documentId) => {
    const responseDocument = await getDocumentByIdAndUserId(documentId);
    if (responseDocument.status === 200) {
      setDocumentData(responseDocument.data);
    }
  };

  /* eslint-disable */
  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId);
    }
  }, [documentId]);
  /* eslint-enable */

  /**This is for select emails */
  const handleChangeSelectEmail = (event) => {
    const email = event.target.value;

    if (event.target.checked) {
      // Checkbox is checked, add the email to the selectedEmails array
      setSelectedEmails((prevSelectedEmails) => [...prevSelectedEmails, email]);
    } else {
      // Checkbox is unchecked, remove the email from the selectedEmails array
      setSelectedEmails((prevSelectedEmails) =>
        prevSelectedEmails.filter((selectedEmail) => selectedEmail !== email)
      );
    }
  };
  console.log("selectedEmails", selectedEmails);
  const sendReminderHandller = async () => {
    const response = await sendReminderForSign(
      selectedEmails,
      documentData,
      user.email,
      user.fullName
    );
    if (response.status === 200) {
      showSuccess(response.message);
      modalClose();
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
              heading={"Send Reminder"}
              modalClose={modalClose}
            />
            <ModalDescription
              description={
                "Choose the signers to send an email reminder to complete the document signature."
              }
            />
            <Box>
              {documentData?.signingOrder?.map((item, index) => {
                return (
                  <UserEmails
                    signingOrder={item}
                    handleChange={handleChangeSelectEmail}
                  />
                );
              })}
            </Box>
            <ModalFooter
              modalClose={modalClose}
              saveBtnText={"Send Reminder"}
              saveButtonOnclick={sendReminderHandller}
            />
          </Card>
        </>
      </Modal>
    </>
  );
};

export default SendReminder;
