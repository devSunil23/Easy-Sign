import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme)=>
  ({
    root: {
      "& .MuiDataGrid-root": {
        backgroundColor: theme.palette.background.default, // Change the background color of the DataGrid
      },
      "& .MuiDataGrid-cell": {
        border: `1px solid ${theme.palette.custom.border}`, // Add a border to each cell
      },
      "& .MuiDataGrid-header": {
        backgroundColor: "lightblue", // Change the background color of the header
      },
      "& .MuiDataGrid-row:hover": {
        backgroundColor: "#ededed", // Change the background color of a row on hover
      },
      "& .MuiDataGrid-row.Mui-selected": {
        backgroundColor: "lightgreen", // Change the background color of a selected row
      },
    },
     
  })
  );

  export default useStyles;