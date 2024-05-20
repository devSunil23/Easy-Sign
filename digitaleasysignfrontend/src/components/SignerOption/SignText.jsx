import { FormLabel, IconButton } from "@mui/material";
import React from "react";

const SignText = ({ item, onBTNclick, emptyFunction, drag }) => {
  return (
    <>
      <IconButton
        id={item.name}
        aria-label="add"
        style={{
          border: "1px solid #295c97",
          "border-radius": "3px",
          width: "100px",
          zIndex: "999",
          cursor: "grab",
          padding: "5px",
          backgroundColor: "transparent",
        }}
        draggable="true"
        onClick={
          item?.itemSign?.id === "sign" || item?.itemSign?.id === "initial"
            ? () => onBTNclick(item.name)
            : emptyFunction
        }
        onDragStart={(ev) => drag(ev, item)}
      >
        <FormLabel
          style={{
            "padding-left": "10px",
            fontFamily: `${item.fontFamily}`,
            color: "black",
            "font-size": "16px",
          }}
        >
          {item?.filledText}
        </FormLabel>
      </IconButton>
    </>
  );
};

export default SignText;
