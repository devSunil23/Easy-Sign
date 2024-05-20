import { Checkbox, FormLabel, IconButton, Typography } from "@mui/material";
import React from "react";
import DatePicker from "react-datepicker";
import CustomTextField from "../Common/CustomTextField";
const SignerIcon = ({
  handlePopoverClick,
  id,
  drag,
  src,
  item,
  signerName,
  filledText,
  onChangeDatePickerHandller,
  onChangeCheckBoxHandller,
  onChangeTextHandller,
  otherSignerEmail,
}) => {
  const isAbleSign = item.signerEmail === otherSignerEmail;
  const signatrueYourSelf = "yourself" === item.signerType;
  return (
    <IconButton
      disableFocusRipple
      disableRipple
      disableTouchRipple
      id={id}
      aria-label="add"
      style={
        (item?.itemSign?.id === "date" || item?.itemSign?.id === "text") &&
        isAbleSign
          ? {
              border: "1px solid #eee",
              "border-radius": "0px",
              width: "120px",
              zIndex: "999",
              cursor: "grab",
              padding: "5px",
            }
          : item?.itemSign?.id === "checkbox" && isAbleSign
          ? {
              "border-radius": "0px",
              border: "1px solid #295c97",
              width: "100px",
              backgroundColor: "transparent",
              zIndex: "999",
              cursor: "grab",
            }
          : {
              border: "1px solid #eee",
              "border-radius": "0px",
              width: "190px",
              zIndex: "999",
              cursor: "grab",
              padding: "5px",
            }
      }
      onClick={(e)=>{handlePopoverClick(e,item)}}
      variant="contained"
      draggable="false"
      // onDragStart={(ev) => drag(ev, item)}
      aria-describedby="simple-popover"
    >
      {item?.itemSign?.id === "date" && isAbleSign ? (
        <>
          <img src={item?.itemSign?.src} alt="React Logo" />
          <DatePicker
            selected={new Date(item.date)}
            onChange={(date) => onChangeDatePickerHandller(date, item.name)}
            className="datePickerStyle"
          />
        </>
      ) : item?.itemSign?.id === "date" && signatrueYourSelf ? (
        <DatePicker
          selected={new Date(item.date)}
          className="datePickerStyle"
          readOnly
        />
      ) : item?.itemSign?.id === "checkbox" && signatrueYourSelf ? (
        <Checkbox
          checked={item.checked}
          name={item.name}
          color="primary"
          className="defautlCheckBoxStyle"
          readOnly
        />
      ) : item?.itemSign?.id === "checkbox" && isAbleSign ? (
        <Checkbox
          checked={item.checked}
          name={item.name}
          onChange={onChangeCheckBoxHandller}
          color="primary"
          className="defautlCheckBoxStyle"
        />
      ) : item?.itemSign?.id === "text" && isAbleSign ? (
        <>
          {/* <TextField
            variant="standard" // You can change this to "filled" or "standard"
            fullWidth
            className="textFieldStyle"
            defaultValue={item.text}
            value={item.text}
            name={item.name}
            onChange={onChangeTextHandller}
            
          /> */}
          <CustomTextField
            defaultValue={item.text}
            inputValue={item.text}
            name={item.name}
            handleInputChange={onChangeTextHandller}
          />
        </>
      ) : item?.itemSign?.id === "text" && signatrueYourSelf ? (
        <Typography variant="body1">{item?.text}</Typography>
      ) : item?.signatureDataUrl ? (
        <img
          src={item?.signatureDataUrl}
          alt="React Logo"
          className="signatureDrawStyle"
        />
      ) : filledText ? (
        <FormLabel
          style={{
            "padding-left": "10px",
            fontFamily: `${item.fontFamily}`,
            // color: "black",
            "font-size": "16px",
          }}
        >
          {filledText}
        </FormLabel>
      ) : (
        <>
          <img src={src} alt="React Logo" />{" "}
          <FormLabel style={{ "padding-left": "3px" }}>{signerName}</FormLabel>
        </>
      )}
    </IconButton>
  );
};

export default SignerIcon;
