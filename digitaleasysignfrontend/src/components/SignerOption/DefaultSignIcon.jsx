import { FormLabel, IconButton } from "@mui/material";
import React from "react";

const DefaultSignIcon = ({ item, onBTNclick, emptyFunction, drag }) => {
  return (
    <>
      <IconButton
        id={item.name}
        aria-label="add"
        style={{
          border: "1px solid #eee",
          "border-radius": "0px",
          width: "100px",
          zIndex: "999",
          cursor: "grab",
          padding: "5px",
        }}
        draggable="true"
        onClick={
          item?.itemSign?.id === "sign" || item?.itemSign?.id === "initial"
            ? () => onBTNclick(item.name)
            : emptyFunction
        }
        onDragStart={(ev) => drag(ev, item)}
      >
        <img src={item?.itemSign?.src} alt="React Logo" />{" "}
        <FormLabel style={{ "padding-left": "10px" }}>
          {item?.itemSign?.textName}
        </FormLabel>
      </IconButton>
    </>
  );
};

export default DefaultSignIcon;
