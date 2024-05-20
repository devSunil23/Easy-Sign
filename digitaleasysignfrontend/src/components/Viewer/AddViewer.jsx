import { FormLabel, IconButton, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import styles from "../../style/addViewer.module.css";
import { useDispatch } from "react-redux";
import { addViewerEmail } from "../../store/action";
const AddViewer = () => {
  const [addViewer, setAddViewer] = useState([""]);
  const dispatch = useDispatch();
  /**text change handller */
  const handleTextChange = (index, event) => {
    const { value } = event.target;
    const newEmails = [...addViewer];
    newEmails[index] = value;
    dispatch(addViewerEmail(newEmails));
    setAddViewer(newEmails);
  };
  /**handle add viewer */
  const handleAddRecipient = () => {
    dispatch(addViewerEmail([...addViewer, ""]));
    setAddViewer([...addViewer, ""]);
  };
  /**handle remove viewer */
  const handleRemoveViewr = (indexToRemove) => {
    const filterViewerEmail = addViewer?.filter((_, index) => {
      return index !== indexToRemove;
    });
    setAddViewer(filterViewerEmail);
    dispatch(addViewerEmail(filterViewerEmail));
  };

  return (
    <>
      <Typography
        variant="h6"
        style={{
          "text-align": "left",
          "font-size": "16px",
          margin: "5px",
          marginTop: "8px",
          color: "#2D3C50",
        }}
      >
        Add Viewers
      </Typography>

      <div>
        {addViewer?.map((email, index) => (
          <div key={index} className={styles.addViewerTextAndAdd}>
            <TextField
              label={`Viewer Email ${index + 1}`}
              name={`recipient-${index}`}
              value={email}
              onChange={(e) => handleTextChange(index, e)}
              fullWidth
              size="small"
              style={{
                margin: "5px 0",
                width: "95%",
              }}
              InputProps={{
                style: { fontSize: "14px", color: "#2D3C50" },
              }} // Set font size here
            />
            <IconButton
              aria-label="remove"
              onClick={() => handleRemoveViewr(index)}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </div>
        ))}
      </div>
      <IconButton
        aria-label="add"
        style={{
          borderRadius: "0px",
          width: "100%",
        }}
        className={styles.addViewerButton}
        onClick={handleAddRecipient}
      >
        <AddCircleOutlineIcon />
        <FormLabel style={{ paddingLeft: "10px" }}>Add Viewer</FormLabel>
      </IconButton>
    </>
  );
};

export default AddViewer;
