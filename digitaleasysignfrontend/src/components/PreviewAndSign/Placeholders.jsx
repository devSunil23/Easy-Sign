import React from 'react';
import { Document, Page } from "react-pdf";

import { 
    IconButton,
    FormLabel,
    Popover ,
    List,
    ListItem,
    ListItemText,
   Checkbox,
   Paper
} from '@mui/material';
import DatePicker from "react-datepicker";
import SignerIcon from '../Icons/SignerIcon';
import PreviewOnlySign from '../PreviewOnlySign';
import CustomTextField from '../Common/CustomTextField';

const Placeholders = ({
    placeholders,
    pageNumber,
    onlyPreviewDocument,
    otherSignerEmail,
    handlePopoverClick,
    onChangeDatePickerHandler,
    onChangeCheckBoxHandler,
    onChangeTextHandler,
    drag,
    onBTNclick,
    emptyFunction,
    pdfFile,
    onPageLoadSuccess,
    handleOnLoadSuccess,
    numPages,
    drop,
    handlePopoverClose,
    onChangeSignerHandler,
    inputFields,
    selectedAction,
    classes,
    anchorEl,
}) =>{
    return (
        <div
        id="divd2"
        style={{
          "min-width": "auto",
          "max-width": "767px",
          "margin-right": "12px",
          position: "relative",
          overflow: "auto",
        }}
      >
        <div
          id="divd1"
          onDrop={drop}
          // onDragOver={allowDrop}
          onDragOver={(ev) => ev.preventDefault()}
          style={{
            "transform-origin": "left top",
            margin: "0px",
           // overflow: "scroll",
           // border: '2px solid black',
            padding:'2rem',
          //  height: '100vh', /* 100% of the viewport height */
          //  overflowY:'scroll',
          }}
        >
          <Paper elevation={10} className={classes.customPaper} >
          {placeholders?.map((item, index) => {
            if (item.pageNumber === pageNumber) {
              return (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    left: `${item.left}px`,
                    top: `${item.top}px`,
                    width: "100px",
                  }}
                >
                  {onlyPreviewDocument ? (
                    <>
                      <PreviewOnlySign item={item} />
                    </>
                  ) : otherSignerEmail ? (
                    <>
                      <SignerIcon
                        id={item.name}
                        drag={drag}
                        handlePopoverClick={
                          otherSignerEmail === item.signerEmail
                            ? item?.itemSign?.id === "sign" ||
                              item?.itemSign?.id === "initial"
                              ? () => onBTNclick(item.name)
                              : emptyFunction
                            : emptyFunction
                        }
                        onChangeDatePickerHandller={
                          onChangeDatePickerHandler
                        }
                        signerName={item?.signerName}
                        src={item?.itemSign?.src}
                        key={index}
                        item={item}
                        filledText={
                          item.filledText ? item.filledText : false
                        }
                        onChangeCheckBoxHandller={
                          onChangeCheckBoxHandler
                        }
                        onChangeTextHandller={onChangeTextHandler}
                        otherSignerEmail={otherSignerEmail}
                      />
                    </>
                  ) : (
                    <>
                      {item.signerType !== "yourself" ? (
                        <div>
                          <IconButton
                            id={item.name}
                            aria-label="add"
                            style={{
                              border: "1px solid #eee",
                              "border-radius": "0px",
                              width: "190px",
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
                            <img
                              src={item?.itemSign?.src}
                              alt="React Logo"
                            />{" "}
                            <FormLabel
                              style={{ "padding-left": "3px" }}
                            >
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
                                      onChangeSignerHandler(
                                        itemEmail?.email,
                                        itemEmail?.name,
                                        selectedAction,
                                        item.name
                                      )
                                    }
                                  >
                                    <ListItemText
                                      primary={itemEmail?.name}
                                    />
                                  </ListItem>
                                );
                              })}
                              <ListItem
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  onChangeSignerHandler(
                                    "",
                                    "",
                                    "yourself",
                                    item.name
                                  )
                                }
                              >
                                <ListItemText primary={"Me"} />
                              </ListItem>
                            </List>
                          </Popover>
                          {/* <PopoverComponent id={item.name} open={true} /> */}
                        </div>
                      ) : item?.filledText ? (
                        <>
                          <IconButton
                            id={item.name}
                            aria-label="add"
                            style={{
                              border: "1px solid #295c97",
                              "border-radius": "3px",
                              width: "200px",
                              minHeight: "20px",
                              zIndex: "999",
                              cursor: "grab",
                              padding: "5px",
                              backgroundColor: "transparent",
                              overflowWrap: "break-all",
                              wordWrap: "break-all",
                            }}
                            draggable="true"
                            onClick={
                              item?.itemSign?.id === "sign" ||
                              item?.itemSign?.id === "initial"
                                ? () => onBTNclick(item.name)
                                : emptyFunction
                            }
                            onDragStart={(ev) => drag(ev, item)}
                          >
                            <FormLabel
                              style={{
                                "padding-left": "10px",
                                fontFamily: `${item.fontFamily}`,
                                color: "black",
                                "font-size": "16px",
                              }}
                            >
                              {item?.filledText}
                            </FormLabel>
                          </IconButton>
                        </>
                      ) : item?.signatureDataUrl ? (
                        <IconButton
                          id={item.name}
                          aria-label="add"
                          style={{
                            border: "2px solid #295c97",
                            "border-radius": "3px",
                            width: "100px",
                            zIndex: "999",
                            cursor: "grab",
                            backgroundColor: "transparent",
                          }}
                          draggable="true"
                          onClick={
                            item?.itemSign?.sign
                              ? () => onBTNclick(item.name)
                              : emptyFunction
                          }
                          onDragStart={(ev) => drag(ev, item)}
                        >
                          <img
                            src={item?.signatureDataUrl}
                            alt="React Logo"
                            className="signatureDrawStyle"
                          />
                        </IconButton>
                      ) : item?.itemSign?.id === "date" ? ( //This is show for date
                        <IconButton
                          id={item.name}
                          aria-label="add"
                          style={{
                            border: "1px solid #295c97",
                            "border-radius": "0px",
                            // width: "100px",
                            zIndex: "999",
                            cursor: "grab",
                            padding: "5px",
                          }}
                          draggable="true"
                          onDragStart={(ev) => drag(ev, item)}
                        >
                          <img
                            src={item?.itemSign?.src}
                            alt="React Logo"
                          />
                          <DatePicker
                            selected={new Date(item.date)}
                            onChange={(date) =>
                              onChangeDatePickerHandler(
                                date,
                                item.name
                              )
                            }
                            className="datePickerStyle"
                          />
                        </IconButton>
                      ) : item?.itemSign?.id === "text" ? (
                        <IconButton
                          disableFocusRipple
                          disableRipple
                          disableTouchRipple
                          id={item?.name}
                          aria-label="add"
                          style={{
                            border: "1px solid #295c97",
                            "border-radius": "0px",
                            // width: "100px",
                            zIndex: "999",
                            cursor: "grab",
                            padding: "5px",
                          }}
                          draggable="true"
                          onDragStart={(ev) => drag(ev, item)}
                        >
                          {/* <TextField
                          variant="standard" // You can change this to "filled" or "standard"
                          fullWidth
                          className="textFieldStyle"
                          defaultValue={item?.text}
                          value={item?.text}
                          name={item?.name}
                          onChange={onChangeTextHandller}
                          placeholder="TextBox"
                        /> */}
                          <CustomTextField
                            defaultValue={item?.text}
                            inputValue={item?.text}
                            name={item?.name}
                            handleInputChange={onChangeTextHandler}
                            placeholder={"TextBox"}
                          />
                        </IconButton>
                      ) : item?.itemSign?.id === "checkbox" ? (
                        <IconButton
                          id={item.name}
                          aria-label="add"
                          style={{
                            "border-radius": "0px",
                            border: "1px solid #295c97",
                            // width: "100px",
                            backgroundColor: "transparent",
                            zIndex: "999",
                            cursor: "grab",
                          }}
                          draggable="true"
                          onDragStart={(ev) => drag(ev, item)}
                        >
                          <Checkbox
                            checked={item.checked}
                            name={item.name}
                            onChange={onChangeCheckBoxHandler}
                            color="primary"
                            className="defautlCheckBoxStyle"
                          />
                        </IconButton>
                      ) : (
                        <IconButton
                          id={item.name}
                          aria-label="add"
                          style={{
                            border: "1px solid #eee",
                            "border-radius": "0px",
                            width: "100px",
                            zIndex: "999",
                            cursor: "grab",
                            padding: "5px",
                          }}
                          draggable="true"
                          onClick={
                            item?.itemSign?.id === "sign" ||
                            item?.itemSign?.id === "initial"
                              ? () => onBTNclick(item.name)
                              : emptyFunction
                          }
                          onDragStart={(ev) => drag(ev, item)}
                        >
                          <img
                            src={item?.itemSign?.src}
                            alt="React Logo"
                          />{" "}
                          <FormLabel style={{ "padding-left": "10px" }}>
                            {item?.itemSign?.textName}
                          </FormLabel>
                        </IconButton>
                      )}
                    </>
                  )}
                  {/* Render the copied item content here */}
                </div>
              );
            } else {
              return null;
            }
          })}
          {pdfFile && (
            <Document
              file={pdfFile}
              onLoadSuccess={handleOnLoadSuccess}
            >
              <Page
                style={classes.page}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                customTextRenderer={false}
                pageNumber={pageNumber}
                onLoadSuccess={onPageLoadSuccess}
                width={612}
              />
              {numPages && (
                <p style={{ margin: "10px", padding: "10px" }}>
                  Page {pageNumber} of {numPages}
                </p>
              )}
            </Document>
          )}
        </Paper>
        </div>
       
      </div>
    );
}

export default Placeholders;