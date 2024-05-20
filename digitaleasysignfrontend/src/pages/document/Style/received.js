import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    root: {
      "& .MuiDataGrid-root": {
        backgroundColor: "#f9f9f9", // Change the background color of the DataGrid
      },
      "& .MuiDataGrid-cell": {
        border: "1px solid #fff", // Add a border to each cell
      },
      "& .MuiDataGrid-header": {
        backgroundColor: "lightblue", // Change the background color of the header
      },
      "& .MuiDataGrid-row:hover": {
        backgroundColor: "#ededed", // Change the background color of a row on hover
      },
      "& .MuiDataGrid-row.Mui-selected": {
        backgroundColor: "lightblue", // Change the background color of a selected row
      },
    },
  });

  export default useStyles;