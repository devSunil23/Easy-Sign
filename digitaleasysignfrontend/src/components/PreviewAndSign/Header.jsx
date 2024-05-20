import React from 'react';
import { 
    Grid,
    Typography ,
    Button,
    InputLabel,
    FormControl,
    Select,
    MenuItem,

} from '@mui/material';
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Header = ({
    onlyPreviewDocument,
    updatedPdf,
    classes,
    decreasePage,
    increasePage,
    pageNumber,
    numPages,
    zoomPercentage,
    handleClose,
    handleZoomChange,
    actionMenu,
    otherSignerEmail,
    onSubmitButton
}) =>{
    return (
        <Grid
          className="css-7ldjcq-MuiGrid-root"
          container
          spacing={1}
          alignItems="center"
          style={{
            background: "#edf2f5",
            padding: "15px",
            width: "100% !important",
            "margin-left": "0px !important",
          }}
        >
          <Grid item xs={12} sm={3} style={{ "padding-top": "0px !important" }}>
            <Typography variant="h6" component={'h5'} sx={{fontWeight:'bold'}}>
              {onlyPreviewDocument
                ? "Document Preview"
                : updatedPdf
                ? "Final Step for Signing"
                : "Prepare for Signing"}
            </Typography>
          </Grid>
          {updatedPdf ? (
            <Grid item xs={12} sm={6}></Grid>
          ) : (
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2} alignItems="center">
                <Grid item className={classes.borderNext}>
                  <Button
                    className={classes.button}
                    variant="outlined"
                    color="primary"
                    onClick={decreasePage}
                    disabled={pageNumber === 1}
                    startIcon={<NavigateBeforeIcon />}
                  >
                    Prev
                  </Button>
                  <Button
                    className={classes.button}
                    variant="outlined"
                    color="primary"
                    onClick={increasePage}
                    disabled={pageNumber === numPages}
                    endIcon={<NavigateNextIcon />}
                  >
                    Next
                  </Button>
                </Grid>
                <Grid item>
                  <FormControl sx={{ m: 0, minWidth: 60 }}>
                    <InputLabel id="demo-simple-select-helper-label">
                      Zoom
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={zoomPercentage}
                      label="Zoom"
                      onChange={handleZoomChange}
                      sx={{ padding: "0px 10px" }}
                    >
                      <MenuItem value={25}>25%</MenuItem>
                      <MenuItem value={50}>50%</MenuItem>
                      <MenuItem value={75}>75%</MenuItem>
                      <MenuItem value={100}>100%</MenuItem>
                      <MenuItem value={125}>125%</MenuItem>
                      <MenuItem value={150}>150%</MenuItem>
                      <MenuItem value={175}>175%</MenuItem>
                      <MenuItem value={200}>200%</MenuItem>
                      <MenuItem value={225}>225%</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid item xs={12} sm={3} spacing={2}>
            <Grid item>
              {
                <Button
                  className={classes.button}
                  variant="text"
                  color="primary"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              }
              {updatedPdf ? (
                ""
              ) : !actionMenu && !otherSignerEmail ? (
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  style={{
                    "border-radius": "5px",
                    width: "50%",
                    opacity: 0.3,
                  }}
                >
                  Save
                </Button>
              ) : (
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={onSubmitButton}
                  style={{
                    "border-radius": "5px",
                    width: "50%",
                  }}
                >
                  Save
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
    );
}

export default Header;