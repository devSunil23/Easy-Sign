import { IconButton } from "@mui/material";
import React from "react";
import DatePicker from "react-datepicker";
const DatePickerSign = ({ item, drag, onChangeDatePickerHandller }) => {
  return (
    <IconButton
      id={item.name}
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
      <img src={item?.itemSign?.src} alt="React Logo" />
      <DatePicker
        selected={new Date(item.date)}
        onChange={(date) => onChangeDatePickerHandller(date, item.name)}
        className="datePickerStyle"
      />
    </IconButton>
  );
};

export default DatePickerSign;
