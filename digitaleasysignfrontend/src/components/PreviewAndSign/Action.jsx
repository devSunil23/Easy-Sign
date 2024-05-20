import React from 'react';
import { 
    Typography,
    Card,
    FormControl,
    RadioGroup,
    CardContent,
    FormControlLabel,
    TextField,
    Radio,
    IconButton,
    Divider,
    FormLabel,
    Button,
 } from '@mui/material';
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const Action = ({
    selectedAction,
    handleInputFieldOrderChange,
    inputFieldOrder,
    handleInputChange,
    handleRemoveInputField,
    handleAddInputField,
    recipientEmails,
    handleRecipientChange,
    handleRemoveRecipient,
    handleAddRecipient,
    handleAction,
    handleActionChange,
    inputFields,
    classes,
    emailError

}) =>{
  const validateEmail = (email) => {
    // A simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
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
            Choose an action
          </Typography>
          <Card
            style={{
              "margin-right": "1px",
              marginTop: "10px",
            }}
          >
            <CardContent>
              <FormControl
                style={{
                  "font-size": "14px !important",
                }}
              >
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="yourself"
                  name="radio-buttons-group"
                  onChange={handleActionChange}
                  value={selectedAction}
                >
                  <FormControlLabel
                    value="yourself"
                    control={<Radio />}
                    label="Sign a Document"
                  />
                  <FormControlLabel
                    value="signandsend"
                    control={<Radio />}
                    label="Sign & Send for Signature"
                  />
                  <FormControlLabel
                    value="send"
                    control={<Radio />}
                    label="Send for Signature"
                  />
                </RadioGroup>
              </FormControl>
              {selectedAction !== "yourself" && (
                <DragDropContext
                  onDragEnd={handleInputFieldOrderChange}
                >
                  <Droppable droppableId="inputFields">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          marginTop: "15px",
                        }}
                      >
                        {inputFieldOrder.map((index, idx) => (
                          <Draggable
                            key={index}
                            draggableId={`inputField-${index}`}
                            index={idx}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TextField
                                  fullWidth
                                  label={`Name ${idx + 1}`}
                                  name="name"
                                  value={inputFields[index]?.name}
                                  onChange={(e) =>
                                    handleInputChange(index, e)
                                  } // Corrected this line
                                  size="small"
                                  style={{
                                    marginBottom: "10px",
                                    width: "80%",
                                    marginLeft: "20px",
                                  }}
                                  InputProps={{
                                    style: {
                                      fontSize: "14px",
                                    },
                                  }} // Set font size here
                                />

                                <TextField
                                  fullWidth
                                  label={`Email ${idx + 1}`}
                                  name="email"
                                  value={
                                    inputFields[index]?.email
                                  }
                                  onChange={(e) =>
                                    handleInputChange(index, e)
                                  } // Corrected this line
                                  size="small"
                                  style={{
                                    marginBottom: "10px",
                                    width: "80%",
                                    marginLeft: "20px",
                                  }}
                                  InputProps={{
                                    style: { fontSize: "14px" },
                                  }} // Set font size here
                                />
                                <div
                                  className="arrow-icons"
                                  style={{ alignItems: "center" }}
                                >
                                  {idx !== 0 && (
                                    <ArrowUpwardIcon
                                      className="arrow-icon"
                                      fontSize="14"
                                    />
                                  )}
                                  {idx !==
                                    inputFieldOrder.length -
                                      1 && (
                                    <ArrowDownwardIcon
                                      className="arrow-icon"
                                      fontSize="14"
                                    />
                                  )}
                                </div>
                                {idx !== 0 && ( // Conditionally render the remove button for all except index 1
                                  <IconButton
                                    aria-label="remove"
                                    onClick={() =>
                                      handleRemoveInputField(
                                        index
                                      )
                                    }
                                  >
                                    <RemoveCircleOutlineIcon />
                                  </IconButton>
                                )}
                                {idx ===
                                  inputFieldOrder.length - 1 && (
                                  <IconButton
                                    aria-label="add"
                                    onClick={handleAddInputField}
                                  >
                                    <AddCircleOutlineIcon />
                                  </IconButton>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>
        </div>
        <Divider />
        <div style={{ marginTop: "15px" }}>
          <Typography
            variant="h6"
            style={{
              "text-align": "left",
              "font-size": "16px",
              margin: "5px",
              color: "#2D3C50",
            }}
          >
            Add Viewers
          </Typography>
          <br />
          <div>
            {recipientEmails.map((email, index) => (
              <div key={index}>
                <TextField
                  label={`Recipient Email   `} 
                  name={`recipient-${index}`}
                  value={email}
                  placeholder='Recipient Email'
                  onChange={(e) =>
                    handleRecipientChange(index, e)
                  }
                  fullWidth
                  size="small"
                  style={{
                    marginBottom: "10px",
                    width: "80%",
                    marginLeft: "20px",
                  }}
                  error={
                    // (requiredError && email.trim() === "") ||
                    email && !validateEmail(email) ? !validateEmail(email) : false
                  }
                  InputProps={{
                    style: { fontSize: "14px", color: "#2D3C50" },
                  }} // Set font size here
                  helperText={
                    email && !validateEmail(email)
                      ? "Invalid email address"
                      : ""
                  }
                />
                <IconButton
                  aria-label="remove"
                  onClick={() => handleRemoveRecipient(index)}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </div>
            ))}
          </div>
          <IconButton
            aria-label="add"
            style={{
              border: "2px dotted #eee",
              borderRadius: "0px",
              width: "100%",
            }}
            onClick={handleAddRecipient}
          >
            <AddCircleOutlineIcon />
            <FormLabel style={{ paddingLeft: "10px" }}>
              Recipients
            </FormLabel>
          </IconButton>
        </div>
        <Divider />
        <div style={{ marginTop: "15px" }}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            style={{ "border-radius": "5px", width: "95%" }}
            onClick={handleAction}
          >
            Continue
          </Button>
        </div>
      </div>
    );
}

export default Action;