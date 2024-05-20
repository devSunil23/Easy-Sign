import { IconButton, TextField } from "@mui/material";
import React from "react";

const SimpleTextShow = ({ item, drag, onChangeTextHandller }) => {
  return (
    <IconButton
      id={item?.name}
      aria-label="add"
      style={{
        border: "1px solid #295c97",
        "border-radius": "0px",
        // width: "100px",
        zIndex: "999",
        cursor: "grab",
        padding: "5px",
      }}
      draggable="true"
      onDragStart={(ev) => drag(ev, item)}
    >
      <TextField
        variant="standard" // You can change this to "filled" or "standard"
        fullWidth
        className="textFieldStyle"
        defaultValue={item?.text}
        value={item?.text}
        name={item?.name}
        onChange={onChangeTextHandller}
        placeholder="TextBox"
      />
    </IconButton>
  );
};

export default SimpleTextShow;
