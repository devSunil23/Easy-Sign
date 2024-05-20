import { Button, Tooltip, Typography } from "@mui/material";
import React from "react";
import DraftsIcon from "@mui/icons-material/Drafts";
import { Link } from "react-router-dom";
const CreateNewDocument = () => {
  return (
    <div>
      <Typography
        sx={{
          border: `1px solid #424242`,
          height: "230px",
          "text-align": "center",
          padding: "80px",
        }}
      >
        <DraftsIcon /> <br />
        No matches found for your current search. <br />
        <br />{" "}
        <Link to={"/"}>
          <Tooltip title="Create new Document" arrow placement="right">
          <Button aria-describedby={"createnewdocument"} variant="contained">
            Create new Document
          </Button>
          </Tooltip>
        </Link>
      </Typography>
    </div>
  );
};

export default CreateNewDocument;
