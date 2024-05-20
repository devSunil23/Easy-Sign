import { Breadcrumbs, Button, Grid, Tooltip } from "@mui/material";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
const BreadCrumbTable = ({ breadCrumbData, onClick }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} sx={{ marginTop: "5px" }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadCrumbData?.map((item, index) => {
            return (
              <Tooltip title={item.name}>
              <Button
                variant="text"
                key={index}
                onClick={() => onClick(item._id)}
              >
                {item.name}
              </Button>
              </Tooltip>
            );
          })}
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
};

export default BreadCrumbTable;
