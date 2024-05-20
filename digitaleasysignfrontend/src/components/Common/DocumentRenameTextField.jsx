import { TextField } from "@mui/material";
import React from "react";
import styles from "../../style/options.module.css";
const DocumentRenameTextField = ({ value, onChange, onEnterPress }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Call the provided onEnterPress function
      onEnterPress();
    }
  };
  return (
    <>
      <TextField
        value={value}
        className={styles.textFieldRename}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        InputProps={{
          style: {
            border: "none",
            outline: "none",
          },
        }}
      />
    </>
  );
};

export default DocumentRenameTextField;
