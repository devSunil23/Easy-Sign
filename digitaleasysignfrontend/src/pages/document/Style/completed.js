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
    datePicker: {
      marginTop: 'auto', // Adjust the top margin
      marginBottom: 'auto', // Adjust the bottom margin
      '& .MuiInputBase-input': {
        // Change the input font size and padding
        fontSize: '15px', // Adjust the font size
        padding: '8px 12px', // Adjust the padding
      },
      '& .MuiSvgIcon-root': {
        // Change the icon size
        width: '.7em', // Adjust the width
        height: '.7em', // Adjust the height
      },
    },
  
  });

  export default useStyles