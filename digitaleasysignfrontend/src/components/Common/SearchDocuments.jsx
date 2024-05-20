import { Box, Grid, InputAdornment, TextField, Tooltip } from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
const SearchDocuments = ({ onChangeSearchHandller }) => {
  return (
    <Grid item xs={12} md={3}>
      <Box sx={{ "& > :not(style)": { m: 1 } }}>
        <Tooltip title="Search Documents..." arrow placement="top">
        <TextField
          id="input-with-icon-textfield"
          label="Search for Documents..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={onChangeSearchHandller}
          variant="standard"
        />
        </Tooltip>
      </Box>
    </Grid>
  );
};

export default SearchDocuments;
