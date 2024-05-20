import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import "../../style/signaturePreview.css";
import { useDispatch } from "react-redux";
import {
  selectSignatureText,
  selectSignatureTextType,
  selectsignatureDataurl,
} from "../../store/action";
const UploadAndPreview = () => {
  const [file, setFile] = useState();
  const dispatch = useDispatch();
  function handleChange(e) {
    const imageUrl = URL.createObjectURL(e.target.files[0]);
    setFile(imageUrl);
    const img = new Image();
    img.onload = function () {
      // Draw the image on a canvas
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      // Convert canvas content to data URL
      const dataUrl = canvas.toDataURL("image/png");
      // Now you can use the data URL for further processing
      dispatch(selectsignatureDataurl(dataUrl));
    };
    img.src = imageUrl;
    /**reset other method signature text */
    dispatch(selectSignatureText(undefined));
    dispatch(selectSignatureTextType("Arial"));
  }

  return (
    <Box sx={{ textAlign: "center" }}>
      <Grid container spacing={1} style={{ marginTop: "1rem" }}>
        <Grid item xs={12} md={3}>
          <div className="App">
            <h4>Upload Image:</h4>
            <input
              style={label_file_upload}
              type="file"
              onChange={handleChange}
            />
          </div>
        </Grid>
        <Grid item xs={12} md={9}>
          {file && (
            <img src={file} alt="showing" className="signaturePreview" />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

const label_file_upload = {
  height: "100%",
  display: "flex",
  "align-items": "center",
  "justify-content": "center",
  "border-width": "2px",
  "border-radius": "1rem",
  "border-style": "dashed",
  "border-color": "#cbd5e1",
  backgroundColor: "#f8fafc",
};

export default UploadAndPreview;
