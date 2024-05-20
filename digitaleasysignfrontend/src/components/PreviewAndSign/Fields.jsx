import React from 'react';
import { 
    Typography,
    Stack,
    FormControl,
    IconButton,
    FormLabel,
    Paper,
    Box,
 } from '@mui/material';
import DeleteIcon from '../../style/delete.svg';
import useStyles from './Style';
 import CreateSignature from '../CreateSignature/CreateSignature';

//  const useStyles = makeStyles((theme) => ({
//   paperWithElevation: {
//     boxShadow: `5px 0px 10px -5px ${theme.palette.grey[400]}, -5px 0px 10px -5px ${theme.palette.grey[400]}`,
//     // Adjust the values and color as needed
//     padding:'1rem',
//    // backgroundColor:'lightgray'
//   },
// }));

const Fields = ({
    signOpen,
    signTextRender,
    otherSignerEmail,
    generateSignature,
    drag,
    currentPlaceholder,
    handleDeleteCurrentPlaceholder,
}) =>{
  const classes = useStyles();
    return (
        <Paper elevation={10} className={classes.customPaper} sx={{padding:'.5rem'}} >
        <div style={{ marginTop: "15px" }}>
          {!otherSignerEmail && (
            <Typography
              variant="h6"
              style={{
                "text-align": "left",
                "font-size": "16px",
                margin: "5px",
              }}
            >
              Fields
            </Typography>
          )}
          <Stack direction="column" spacing={1}>
            {!otherSignerEmail && (
              <FormControl id="buttonsID">
                {signTextRender?.map((itemSign, index) => {
                  return (
                    <IconButton
                      key={index}
                      id={itemSign?.id}
                      aria-label="add"
                      style={{
                        border: "1px solid #eee",
                        "border-radius": "0px",
                        width: "80%",
                        zIndex: "999",
                        cursor: "grab",
                      }}
                      draggable="true"
                      // onDragStart={drag}
                      onDragStart={(ev) => drag(ev, itemSign)}
                      // onClick={onBTNclick}
                    >
                      <FormLabel>
                        <img
                          src={itemSign?.src}
                          alt="React Logo"
                        />{" "}
                      </FormLabel>
                      <FormLabel
                        style={{ "padding-left": "10px" }}
                      >
                        {itemSign?.textName}
                      </FormLabel>
                    </IconButton>
                  );
                })}
              </FormControl>
            )}
            {signOpen && (
              <CreateSignature
                createSignatrue={generateSignature}
              />
            )}
          </Stack>
        </div>
        
        {currentPlaceholder && 
         <Stack direction={'column'} spacing={2} marginTop={'2rem'}>
           <Box sx={{display:'flex',justifyContent:'space-between'}}>
              <Box>
              <FormLabel>
                        <img
                          src={currentPlaceholder.itemSign?.src}
                          alt="React Logo"
                        />{" "}
             </FormLabel>
                      <FormLabel
                        style={{ "padding-left": "10px" }}
                      >
                        {currentPlaceholder.itemSign?.textName}
                      </FormLabel>
              </Box>
            <IconButton
                                        id='drag5'
                                        aria-label='add'
                                        // style={{
                                        //     border: '1px solid #eee',
                                        //     'border-radius': '0px',
                                        //     width: '100%',
                                        // }}
                                        onClick={handleDeleteCurrentPlaceholder}
                                    >
                                        <img
                                            src={DeleteIcon}
                                            alt='React Logo'
                                        />{' '}
                                       
                                    </IconButton>
           </Box>
           <Typography>Assign To: {currentPlaceholder?.signerName}</Typography>
           <Typography>Font Family: {currentPlaceholder?.fontFamily}</Typography>
        </Stack>
        }
       
      </Paper>
    );
}

export default Fields;