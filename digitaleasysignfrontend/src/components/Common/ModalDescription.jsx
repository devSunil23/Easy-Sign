import { Box, Typography } from "@mui/material";
import React from "react";

const ModalDescription = ({ description }) => {
  return (
    <Box mb={2} width={600}>
      <Typography variant="text" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
};

export default ModalDescription;
