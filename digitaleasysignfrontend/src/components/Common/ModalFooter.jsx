import { Box, Button } from "@mui/material";
import React from "react";

const ModalFooter = ({ saveButtonOnclick, saveBtnText, modalClose }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "10px",
      }}
    >
      <Button variant="text" onClick={modalClose}>
        Cancel
      </Button>
      <Button variant="contained" color="primary" onClick={saveButtonOnclick}>
        {saveBtnText}
      </Button>
    </Box>
  );
};

export default ModalFooter;
