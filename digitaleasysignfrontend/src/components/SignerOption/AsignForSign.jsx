import {
  FormLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
} from "@mui/material";
import React from "react";

const AsignForSign = ({
  item,
  handlePopoverClick,
  drag,
  handlePopoverClose,
  anchorEl,
  inputFields,
  onChangeSignerHandller,
  selectedAction,
}) => {
  console.log("defaultSignIcon");
  return (
    <div>
      <IconButton
        id={item.name}
        aria-label="add"
        style={{
          border: "1px solid #eee",
          "border-radius": "0px",
          "min-width": "190px",
          zIndex: "999",
          cursor: "grab",
          padding: "5px",
        }}
        onClick={(e)=>{handlePopoverClick(e,item)}}
        variant="contained"
        draggable="true"
        onDragStart={(ev) => drag(ev, item)}
        aria-describedby="simple-popover"
      >
        <img src={item?.itemSign?.src} alt="React Logo" />{" "}
        <FormLabel style={{ "padding-left": "3px" }}>
          {item?.signerName}
        </FormLabel>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <List>
          <ListItem>
            <ListItemText primary="WHO FILLES THIS OUT?" />
          </ListItem>
          {inputFields?.map((itemEmail, index) => {
            return (
              <ListItem
                style={{ cursor: "pointer" }}
                onClick={() =>
                  onChangeSignerHandller(
                    itemEmail?.email,
                    itemEmail?.name,
                    selectedAction,
                    item.name
                  )
                }
              >
                <ListItemText primary={itemEmail?.name} />
              </ListItem>
            );
          })}
          <ListItem
            style={{ cursor: "pointer" }}
            onClick={() =>
              onChangeSignerHandller("", "", "yourself", item.name)
            }
          >
            <ListItemText primary={"Me"} />
          </ListItem>
        </List>
      </Popover>
    </div>
  );
};

export default AsignForSign;
