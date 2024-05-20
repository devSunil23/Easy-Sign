import { FormControl, Grid, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const StatusBasedSearch = ({ defaultStatus }) => {
  const [document, setDocument] = useState(defaultStatus);

  const navigate = useNavigate();
  const doucmentHandleChangeStatus = (e) => {
    const { value } = e.target;
    setDocument(value);
    navigate(`${value}`);
  };
  return (
    <Grid item xs={12} md={3}>
      <Tooltip title="Select the Document by Status" arrow placement="top">
      <FormControl
        sx={{ m: 1, minWidth: 150 }}
        size="small"
        style={{ marginTop: "16px" }}
      >
        <InputLabel id="demo-select-small-label">Status</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={document}
          label="Status"
          onChange={doucmentHandleChangeStatus}
        >
          <MenuItem value={`/documents`}>Documents</MenuItem>
          <MenuItem value={`/documents/draft`}>Draft</MenuItem>
          <MenuItem value={`/documents/completed`}>Completed</MenuItem>
          <MenuItem value={`/documents/awaiting`}>Awaiting</MenuItem>
          <MenuItem value={`/documents/received`}>Awaiting you</MenuItem>
          <MenuItem value={`/documents/voided`}>Voided</MenuItem>
          {/* <MenuItem value={`/documents/declined`}>Declined</MenuItem> */}
        </Select>
      </FormControl>
      </Tooltip>
    </Grid>
  );
};

export default StatusBasedSearch;
