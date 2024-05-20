import { Button, Tooltip } from "@mui/material";
import React from "react";
import styles from "../../style/emptyTrash.module.css";
const EmptyTrash = ({ onClickHandller, style }) => {
  return (
    <>
    <Tooltip title="Clear the trash documents!" arrow placement="top" sx={{backgroundColor:'red'}}>
      <Button
        variant="text"
        className={styles.emptyTrashOutlinedButton}
        onClick={onClickHandller}
        style={style}
      >
        Empty Trash
      </Button>
      </Tooltip>
    </>
  );
};

export default EmptyTrash;
