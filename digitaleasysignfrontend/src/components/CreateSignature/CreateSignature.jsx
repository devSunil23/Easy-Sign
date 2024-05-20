import * as React from "react";
import { useState, useRef } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SignatureCanvas from "react-signature-canvas";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import TextSignature from "./TextSignature";
import UploadAndPreview from "./UploadAndPreview";
import { useDispatch } from "react-redux";
import {
  selectSignatureText,
  selectSignatureTextType,
  selectsignatureDataurl,
} from "../../store/action";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function CreateSignature({ createSignatrue }) {
  const [open, setOpen] = React.useState(true);
  const [selectedDataSet, setSelectedDataSet] = useState("dataset1"); // Initial selected dataset
  const signatureRef = useRef(null);
  const dispatch = useDispatch();
  const handleDataSetChange = (event, newDataSet) => {
    if (newDataSet !== null) {
      setSelectedDataSet(newDataSet);
    }
  };
  const handleClose = (args) => {
    setOpen(false);
    if (args === "create") {
      createSignatrue();
    }
  };

  /**save draw signature */
  const handleSaveSignature = () => {
    const signatureData = signatureRef.current.toDataURL("image/png");
    dispatch(selectsignatureDataurl(signatureData));
    /**reset other method signature text */
    dispatch(selectSignatureText(undefined));
    dispatch(selectSignatureTextType("Arial"));
  };
  const renderDataSet = () => {
    // Define your datasets here
    if (selectedDataSet === "dataset1") {
      return <TextSignature></TextSignature>;
    } else if (selectedDataSet === "dataset2") {
      return (
        <SignatureCanvas
          penColor="black"
          canvasProps={{ width: 500, height: 250, className: "sigCanvas" }}
          sx={{ "border-color": "#000000" }}
          ref={signatureRef}
          onEnd={handleSaveSignature}
        />
      );
    } else if (selectedDataSet === "dataset3") {
      return <UploadAndPreview></UploadAndPreview>;
    }
  };
  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          style={{ "font-size": "16px" }}
        >
          Create Your Signature
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box sx={{ textAlign: "center" }}>
            <Grid container spacing={2} style={{ "min-width": "570px" }}>
              <Grid item xs={12} md={12}>
                <ToggleButtonGroup
                  value={selectedDataSet}
                  exclusive
                  onChange={handleDataSetChange}
                  aria-label="text alignment"
                >
                  <ToggleButton value="dataset1" aria-label="left aligned">
                    <Button variant="text">CHOOSE</Button>
                  </ToggleButton>
                  <ToggleButton value="dataset2" aria-label="centered">
                    <Button variant="text">DRAW</Button>
                  </ToggleButton>
                  <ToggleButton value="dataset3" aria-label="right aligned">
                    <Button variant="text">UPLOAD</Button>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          </Box>
          <div>{renderDataSet()}</div>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            onClick={() => handleClose("create")}
          >
            Create
          </Button>
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
