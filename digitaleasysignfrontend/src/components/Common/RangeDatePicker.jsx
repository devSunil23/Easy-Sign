import { Grid, Tooltip, } from "@mui/material";
import React from "react";
import { DatePicker } from "antd";
//import { useTheme } from '@mui/material/styles';
const { RangePicker } = DatePicker;
const RangeDatePicker = ({ handleDateChange }) => {
  // const {palette} = useTheme()
	// const {background,text} = palette
	
  return (
    <Tooltip title="Get the documents between start & end date" arrow placement="top">
    <Grid item xs={12} md={3} style={{ marginTop: "12px" }}>
      <RangePicker style={{ padding: "9px 5px",}} onChange={handleDateChange} />
    </Grid>
    </Tooltip>
  );
};

export default RangeDatePicker;
