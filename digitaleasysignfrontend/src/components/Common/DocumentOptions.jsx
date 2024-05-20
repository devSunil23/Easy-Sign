import { FormLabel, IconButton } from "@mui/material";
import React from "react";
import styles from "../../style/options.module.css";
const DocumentOptions = ({ onClick, src, id, name }) => {
  return (
    <>
      <IconButton
        id={id}
        aria-label="add"
        style={{
          border: "1px solid #eee",
          "border-radius": "0px",
          width: "100%",
        }}
        onClick={onClick}
      >
        <FormLabel>
          <img src={src} className={styles.logoIcon} alt="React Logo" />{" "}
        </FormLabel>
        <FormLabel style={{ "padding-left": "10px" }}>{name}</FormLabel>
      </IconButton>
    </>
  );
};

export default DocumentOptions;
