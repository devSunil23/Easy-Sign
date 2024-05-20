import { IconButton } from "@mui/material";
import React from "react";

const DrawSignShow = ({ item, onBTNclick, emptyFunction, drag }) => {
  return (
    <IconButton
      id={item.name}
      aria-label="add"
      style={{
        border: "2px solid #295c97",
        "border-radius": "3px",
        width: "100px",
        zIndex: "999",
        cursor: "grab",
        backgroundColor: "transparent",
      }}
      draggable="true"
      onClick={
        item?.itemSign?.sign ? () => onBTNclick(item.name) : emptyFunction
      }
      onDragStart={(ev) => drag(ev, item)}
    >
      <img
        src={item?.signatureDataUrl}
        alt="React Logo"
        className="signatureDrawStyle"
      />
    </IconButton>
  );
};

export default DrawSignShow;
