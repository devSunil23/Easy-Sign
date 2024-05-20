import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
import { makeStyles } from '@mui/styles'; 
import Grid from '@mui/material/Grid'; 
import { useDropzone } from 'react-dropzone'; 
import "react-pdf/dist/esm/Page/TextLayer.css";  

// Configure PDF.js worker path for the library to work
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(2),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  viewer: {
    width: '100%',
    height: 'calc(100vh - 120px)', // Adjust to your preferred height
    maxWidth: 'fit-content', 
  },
  controls: {
    margin: theme.spacing(2, 0),
  },
  button: {
    margin: theme.spacing(1),
  },
  dropzone: {
    width: '100%',
    border: '2px dashed #ccc',
    padding: theme.spacing(4),
    height: "100px",
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#e3ffea',
  },
  dropzoneActive: {
    border: '1px dashed #007bff',
  },
  div1: {
    width: "350px",
    height: "70px",
    padding: "10px",
    border: "1px solid #aaaaaa",
  },
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
}));

const Dropzone = () => { 
  const classes = useStyles();  
  const [scale, setScale] = useState(1);
  const [pdfFile, setPdfFile] = useState(null);

  
  const handleFileChange = (file) => {
    setPdfFile(file);
    setScale(Math.max(scale - 0.6, 0.6)); 
  };
 

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      handleFileChange(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.pdf',
  });

 

  return (
    <div className={classes.root}> 
      <Grid container spacing={2} alignItems="center"> 
      
                       
        {/* {pdfFile && (
        <Grid item xs={12} sm={12}>  
          <PreviewAndSign pdfFile={pdfFile} ></PreviewAndSign>
        </Grid>
        
        )} */}
      {!pdfFile && (
        <Grid item xs={12} sm={12}> 

          <div
            {...getRootProps({
              className: `${classes.dropzone} ${isDragActive ? classes.dropzoneActive : ''}`,
            })} 
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the PDF file here...</p>
            ) : (
              <p>Drag 'n' drop a PDF file here, or click to select one</p>
            )}
          </div>
        </Grid>
        )}
        
      
      </Grid> 
    </div>
  );
} 

  
export default Dropzone;  