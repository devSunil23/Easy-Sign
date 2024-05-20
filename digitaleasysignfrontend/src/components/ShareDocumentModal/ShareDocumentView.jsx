import React from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopyTwoTone";
const ShareDocumentView = ({ value }) => {
  const handleCopyClick = () => {
    // Copy the text to the clipboard (you might want to implement this)
    navigator.clipboard.writeText(value);
  };

  return (
    <TextField
      fullWidth
      size="small"
      value={value}
      disabled
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleCopyClick} edge="end">
              <FileCopyIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default ShareDocumentView;
