import { Checkbox, FormLabel, IconButton, Typography } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";

const PreviewOnlySign = ({ item }) => {
  return (
    <>
      <IconButton
        id={item.name}
        aria-label="add"
        style={{
          // border: "1px solid #295c97",
          "border-radius": "3px",
          //   width: "100px",
          zIndex: "999",
          cursor: "grab",
          padding: "5px",
          backgroundColor: "transparent",
        }}
        draggable="false"
      >
        {item?.itemSign?.id === "text" ? (
          <Typography variant="body1">{item?.text}</Typography>
        ) : item?.itemSign?.id === "date" ? (
          <>
            <DatePicker
              selected={new Date(item.date)}
              className="datePickerStyle"
              readOnly
            />
          </>
        ) : item?.itemSign?.id === "checkbox" ? (
          <Checkbox
            checked={item.checked}
            name={item.name}
            color="primary"
            className="defautlCheckBoxStyle"
            readOnly
          />
        ) : item?.signatureDataUrl ? (
          <img
            src={item?.signatureDataUrl}
            alt="React Logo"
            className="signatureDrawStyle"
          />
        ) : (
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
        )}
      </IconButton>
    </>
  );
};

export default PreviewOnlySign;
