import { Checkbox, IconButton } from "@mui/material";
import React from "react";

const CheckBoxSign = ({ item, drag, onChangeCheckBoxHandller }) => {
  return (
    <>
      <IconButton
        id={item.name}
        aria-label="add"
        style={{
          "border-radius": "0px",
          border: "1px solid #295c97",
          backgroundColor: "transparent",
          zIndex: "999",
          cursor: "grab",
        }}
        draggable="true"
        onDragStart={(ev) => drag(ev, item)}
      >
        <Checkbox
          checked={item.checked}
          name={item.name}
          onChange={onChangeCheckBoxHandller}
          color="primary"
          className="defautlCheckBoxStyle"
        />
      </IconButton>
    </>
  );
};

export default CheckBoxSign;
