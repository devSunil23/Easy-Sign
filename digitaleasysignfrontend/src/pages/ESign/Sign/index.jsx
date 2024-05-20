import React,{useState} from 'react';
import Box from '@mui/material/Box'; 
import Grid from '@mui/material/Grid';
import PreviewPDF from './PreviewPDF';  
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from './TabPanel';
import BulkSend from './BulkSend';
import  makeStyles  from '@mui/styles/makeStyles';
import { Tooltip } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    fixedSizeTab: {
      width: 110, // Define the minimum width for the tabs
      
    },
  }));

const Index = (props) =>{
    const classes = useStyles();
    const [value, setValue] = useState(0); 
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    // <CreateSignature></CreateSignature>
    const headerText =
    <Box sx={{ flexGrow: 1, textAlign: "center" }}>
        <Grid container spacing={2}> 
            <Grid item xs={2} md={2}></Grid>
            <Grid item xs={12} md={8} sx={{marginTop: "25px"}}>
                <Tabs value={value} onChange={handleChange}>
                    <Tooltip title="upload document file here" arrow placement='top'>
                    <Tab label="Upload File" className={classes.fixedSizeTab}/>
                    </Tooltip>
                    <Tooltip title="Send Sign Request in bulk" arrow placement='top'>
                    <Tab label="Bulk Send" className={classes.fixedSizeTab}/>
                    </Tooltip> 
                </Tabs>
            </Grid> 
        </Grid> 
        <Grid container spacing={2}> 
            <Grid item xs={12} md={12}>
                <TabPanel value={value} index={0}>
                    <Grid item xs={12} md={12}  >
                        <PreviewPDF></PreviewPDF>
                    </Grid>  
                </TabPanel> 
                <TabPanel value={value} index={1}>
                    <Grid item xs={12} md={12}  >
                        <BulkSend/>
                    </Grid>  
                </TabPanel> 
            </Grid>
        </Grid>
    </Box>;
    
    return headerText;
}

export default Index;