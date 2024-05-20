import React from 'react';
import {
     Typography,Stack,
     IconButton,FormControl ,
     FormLabel,Divider
} from '@mui/material';
import CreateSignature from '../CreateSignature/CreateSignature';

const Field = ({
    signTextRender,
    signOpen,
    generateSignature,
    drag
}) =>{
    return (
        <div>
        <div style={{ marginTop: "15px" }}>
          
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
          
          <Stack direction="column" spacing={1}>
           
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
            
            {signOpen && (
              <CreateSignature
                createSignatrue={generateSignature}
              />
            )}
          </Stack>
        </div>
        <Divider style={{ width: "80%" }} />
      </div>
    );
}

export default Field;