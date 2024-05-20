import { Box, Card, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import HeadingAndCloseModal from "../Common/HeadingAndCloseModal";
import ModalDescription from "../Common/ModalDescription";
import { getDocumentByIdAndUserId } from "../../pages/document/Functions/document";
import SingerGenerateLink from "./SingerGenerateLink";
const GenerateSingingLinkModal = ({ open, modalClose, documentId }) => {
  const [documentData, setDocumentData] = useState([]);
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
              heading={"Generate signing link"}
              modalClose={modalClose}
            />
            <ModalDescription
              description={
                "Generate signing links for this document and send it to signers to allow them sign the document."
              }
            />
            <hr />
            <br />
            <Box>
              {documentData?.signingOrder
                ?.filter((item) => {
                  return item.status !== "signed";
                })
                ?.map((item, index) => {
                  return (
                    <SingerGenerateLink
                      signingOrder={item}
                      documetDetails={documentData}
                      // handleChange={handleChangeSelectEmail}
                    />
                  );
                })}
            </Box>
          </Card>
        </>
      </Modal>
    </>
  );
};

export default GenerateSingingLinkModal;
