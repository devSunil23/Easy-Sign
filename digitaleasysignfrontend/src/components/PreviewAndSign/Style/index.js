import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      margin: theme.spacing(2),
    },
    header: {
      marginBottom: theme.spacing(2),
    },
    viewer: {
      width: "100%",
      height: "calc(100vh - 120px)", // Adjust to your preferred height
      maxWidth: "fit-content",
    },
    controls: {
      margin: theme.spacing(2, 0),
    },
    button: {
      margin: theme.spacing(1),
    },
    dropzone: {
      width: "100%",
      border: "2px dashed #ccc",
      padding: theme.spacing(4),
      height: "100px",
      textAlign: "center",
      cursor: "pointer",
      backgroundColor: "#e3ffea",
    },
    dropzoneActive: {
      border: "1px dashed #007bff",
    },
    div1: {
      width: "350px",
      height: "70px",
      padding: "10px",
      border: "1px solid #aaaaaa",
    },
    page: {
      flexDirection: "row",
      backgroundColor: "#E4E4E4",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    borderNext: {
      display: "flex",
      "border-right": "1px solid #d2dde3",
      "margin-right": "25px",
      "padding-right": "25px",
    },
    customPaper: {
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Change the values to modify the shadow
      '&.MuiPaper-elevation1': {
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Override elevation 1
      },
      '&.MuiPaper-elevation2': {
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Override elevation 2
      },
      '&.MuiPaper-elevation10': {
        boxShadow: '0px 4px 10px rgba(0, 127, 255, 0.4)', // Override elevation 2
      },
     filedContainer:{
      backgroundColor:'blue',
      paddingRight:'2rem',
      paddingTop:'2rem',
      height: '100vh', /* 100% of the viewport height */
      overflowY: 'scroll',
     }
      // Add more elevation overrides as needed
    },
  }));
  
  export default useStyles;