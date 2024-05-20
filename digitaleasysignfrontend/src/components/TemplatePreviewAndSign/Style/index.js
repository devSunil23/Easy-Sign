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
  
  }));
  
export default useStyles;  