import Close from "@mui/icons-material/Close";
import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";

const HeadingAndCloseModal = ({ heading, modalClose }) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="h6">{heading}</Typography>
      <IconButton onClick={modalClose}>
        <Close sx={{ fontSize: "18px" }} />
      </IconButton>
    </Stack>
  );
};

export default HeadingAndCloseModal;
