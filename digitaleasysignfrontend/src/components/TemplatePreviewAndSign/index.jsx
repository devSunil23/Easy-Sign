import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {
  Checkbox, FormLabel,List,ListItem,
  ListItemText,Popover,
  IconButton, Modal, Grid, 
} from "@mui/material";
import "../../style/pdfPreview.css"
import SignLogo from "../../style/sign.svg"
import CheckboxLogo from "../../style/checkbox.svg";
import DateLogo from "../../style/date.svg";
import InitalsLogo from "../../style/initals.svg";
import TextLogo from "../../style/text.svg";
import { getCookie,setCookie } from "../../utilities/cookies";
import { useMessage } from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { selectSignatureiD } from "../../store/action";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SignerIcon from "../Icons/SignerIcon";
import { useNavigate } from "react-router-dom";
import PreviewOnlySign from "../PreviewOnlySign"
import Header from "./Header";
import Field from "./Field";
import CustomTextField from "../Common/CustomTextField";
import useStyles from "./Style";
import { updateTemplate } from "../../pages/Template/Function";

// import PopoverComponent from "./PopoverComponent";
// Configure PDF.js worker path for the library to work
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const Index = ({
    pdfFile,
    templateData,
    onlyPreviewDocument,
    otherSignerEmail  ,
}) =>{
    const classes = useStyles();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [zoomPercentage, setZoomPercentage] = useState(100); // Default zoom is 75%
    const [actionMenu, setActionMenu] = React.useState(false);
    const [signOpen, setSignOpen] = React.useState(false);
    const [selectedAction, setSelectedAction] = useState("yourself");
    const [open, setOpen] = React.useState(true);
    const [inputFields, setInputFields] = useState([
      { name: "", email: "", status: "pending" },
    ]);
    const [recipientEmails, setRecipientEmails] = useState([]);
    const [placeholders, setPlaceholders] = useState([]);
    const { showError, showSuccess } = useMessage();
    const dispatch = useDispatch();
    const [updatedPdf] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
  
    const handlePopoverClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handlePopoverClose = () => {
      setAnchorEl(null);
    };
  
    /**Text signature */
    const signatureText = useSelector(
      (state) => state.reducerSignature.signatureText
    );
    /***signatureData text */
    const signatureDataUrl = useSelector(
      (state) => state.reducerSignature.signatureDataUrl
    );
  
    /**Signature id */
    const signatureId = useSelector(
      (state) => state.reducerSignature.signatureId
    );
  
    /***Text type signature*/
    const signatureTypeText = useSelector(
      (state) => state.reducerSignature.signatureTextType
    );
   
    const [signTextRender] = useState([
      { id: "sign", src: SignLogo, textName: "Sign" },
      {
        id: "initial",
        src: InitalsLogo,
        textName: "Initial",
        initial: true,
      },
      { id: "date", src: DateLogo, textName: "Date" },
      { id: "text", src: TextLogo, textName: "Text" },
      { id: "checkbox", src: CheckboxLogo, textName: "Checkbox" },
    ]);
    const handleClose = (event, reason) => {
      if (reason && reason === "backdropClick") return;
      setOpen(false);
      navigate("/templates/manage");
      // window.location.reload(); //this is reload when close modal
    };
  
     
      const handleZoomChange = (e) => {
      const newZoomPercentage = parseInt(e.target.value, 10);
      setZoomPercentage(newZoomPercentage);
      // Calculate the scale factor based on the new zoom percentage
      const scaleFactor = newZoomPercentage / 100;
  
      // Get a reference to the "divd1" element
      const divd1Element = document.getElementById("divd1");
  
      // Apply the scale transformation using CSS
      divd1Element.style.transform = `scale(${scaleFactor})`;
    };
  
    const decreasePage = () => {
      setPageNumber(Math.max(pageNumber - 1, 1));
    };
  
    const increasePage = () => {
      setPageNumber(Math.min(pageNumber + 1, numPages));
    };
  
    const handleOnLoadSuccess = ({ numPages }) => {
      if (templateData) {
        setActionMenu(true);
        if (
          window.location.pathname === "/otherSinger"
            ? true
            : getCookie("userId") === templateData.userId
        ) {
          console.log("templateData", templateData);
          if (templateData._id !== null || templateData._id !== undefined) {
            setCookie("templateId", templateData._id);
          }
          setSelectedAction(templateData.selectedAction);
          setPlaceholders(templateData.placeholders);
          setRecipientEmails(templateData.viewers);
          const newInputFields = []
          templateData.roles.forEach(role => {
              newInputFields.push({name:role,email:`${role}@gmail.com`,state:'pending'})
          });
          setInputFields(newInputFields);
          // setTimeout(() => {
          //   templateData.placeholders.forEach((placeholder) => {
          //     const draggged = document.getElementById(placeholder.name);
          //     console.log(draggged);
          //     if (draggged) {
          //       // Set the width to '100px'
          //       draggged.style.width = "100px";
  
          //       // Set the position to 'absolute'
          //       draggged.style.position = "absolute";
  
          //       // Set the left and top positions
          //       draggged.style.left = `${placeholder.left}px`;
          //       draggged.style.top = `${placeholder.top}px`;
  
          //       // Set the border color
          //       draggged.style.borderColor = "#fa9600";
  
          //       // Append the element to 'divd1'
          //       document.getElementById("divd1").appendChild(draggged);
          //     }
          //   });
          // }, 1500);
          setTimeout(() => {
            if (!otherSignerEmail) {
              setActionMenu(false);
            }
          }, 2500);
        }
      }
      setNumPages(numPages);
    };
  
    const drag = (ev, itemSign) => {
      let offsetX = 0;
      let offsetY = 0;
      /*This is track where we are dragging start*/
      if (itemSign.name) {
        const rect = ev.target.getBoundingClientRect();
        offsetX = ev.clientX - rect.left;
        offsetY = ev.clientY - rect.top;
      } else {
        const parentContainer = document.getElementById("divd1");
        const parentRect = parentContainer.getBoundingClientRect();
        const parentLeft = parentRect.left;
        const parentTop = parentRect.top;
        offsetX = parentLeft;
        offsetY = parentTop;
      }
      // Store these values in the DataTransfer object
      ev.dataTransfer.setData(
        "text",
        JSON.stringify({ itemSign, offsetX, offsetY })
      );
      ev.target.setAttribute("data-offset-x", offsetX);
      ev.target.setAttribute("data-offset-y", offsetY);
    };
  
    const onPageLoadSuccess = (page) => {};
  
    /* eslint-disable */
    useEffect(() => {
      if (otherSignerEmail) {
        setActionMenu(true);
      }
       
    }, [otherSignerEmail]);
    /* eslint-enable */
    
    const drop = (ev) => {
      let counter = placeholders?.length + 1;
      ev.preventDefault();
      const data = JSON.parse(ev.dataTransfer.getData("text"));
      // Calculate the new position based on the current mouse coordinates
      const scaleFactor = zoomPercentage / 100;
      const left = (ev.clientX - data.offsetX) / scaleFactor;
      const top = (ev.clientY - data.offsetY) / scaleFactor;
      // Find the position of the parent container
      const parentContainer = document.getElementById("divd1");
      const parentRect = parentContainer.getBoundingClientRect();
      const parentLeft = parentRect.left;
      const parentTop = parentRect.top;
      // Calculate the adjusted position based on the parent's position
      const adjustedLeft = left - parentLeft;
      const adjustedTop = top - parentTop;
      // Add the copied item to the copiedItems stat
      setPlaceholders((prevCopiedItems) => {
        const existingItemIndex = prevCopiedItems.findIndex(
          (item) => item.name === data?.itemSign?.name
        );
  
        if (existingItemIndex !== -1) {
          // If an item with the same name exists, update it
          const updatedCopiedItems = [...prevCopiedItems];
          updatedCopiedItems[existingItemIndex] = {
            ...updatedCopiedItems[existingItemIndex],
            left: adjustedLeft,
            top: adjustedTop,
          };
          return updatedCopiedItems;
        } else {
          // If it doesn't exist, create a new item
          return [
            ...prevCopiedItems,
            {
              ...data,
              left,
              top,
              name: `drag${counter}`,
              checked: null,
              date: new Date(),
              text: undefined,
              filledText: undefined,
              signatureDataUrl: undefined,
              fontFamily: "Arial",
              signerType: undefined,
              signerEmail: inputFields[0]?.email,
              signerName: inputFields[0]?.name,
              pageNumber:pageNumber
            },
          ];
        }
      });
      ev.target.removeAttribute("data-offset-x");
      ev.target.removeAttribute("data-offset-y");
    };
  
    function onBTNclick(id) {
      setSignOpen(!signOpen);
      dispatch(selectSignatureiD(id));
    }
  
    const emptyFunction = () => {};
  
    const handlePageChange = (newPageNumber) => {
      setPageNumber(newPageNumber);
    };
  
    const renderThumbnail = (page) => (
      <div
        key={`thumbnail-${page}`}
        className={`thumbnail ${pageNumber === page ? "active" : ""}`}
        onClick={() => handlePageChange(page)}
      >
        <Document file={pdfFile}>
          <Page
            pageNumber={page}
            width={100}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            customTextRenderer={false}
          />
        </Document>
      </div>
    );
  
    const thumbnails = [];
    for (let page = 1; page <= numPages; page++) {
      thumbnails.push(renderThumbnail(page));
    }
   
    /**update generate signature*/
    const generateSignature = () => {
      setPlaceholders((prevPlaceholders) => {
        return prevPlaceholders.map((obj) => {
          if (obj?.name === signatureId) {
            return {
              ...obj,
              filledText: signatureText,
              fontFamily: signatureTypeText,
              signatureDataUrl: signatureDataUrl,
            };
          }
          return obj; // Return unmodified objects
        });
      });
    };
  
    /**update date*/
    const onChangeDatePickerHandller = (date, name) => {
      setPlaceholders((prevPlaceholders) => {
        return prevPlaceholders.map((obj) => {
          if (obj?.name === name) {
            return {
              ...obj,
              date: date,
            };
          }
          return obj; // Return unmodified objects
        });
      });
    };
  
    /**update date*/
    const onChangeSignerHandller = (
      signerEmail,
      signerName,
      signerType,
      name
    ) => {
      setPlaceholders((prevPlaceholders) => {
        return prevPlaceholders.map((obj) => {
          if (obj?.name === name) {
            return {
              ...obj,
              signerEmail: signerEmail,
              signerName: signerName,
              signerType: signerType,
            };
          }
          return obj; // Return unmodified objects
        });
      });
      handlePopoverClose();
    };
  
    /**update text */
    const onChangeTextHandller = (e) => {
      const { value, name } = e.target;
      setPlaceholders((prevPlaceholders) => {
        return prevPlaceholders.map((obj) => {
          if (obj?.name === name) {
            return {
              ...obj,
              text: value,
            };
          }
          return obj; // Return unmodified objects
        });
      });
    };
  
    /**update checkbox */
    const onChangeCheckBoxHandller = (e) => {
      const { name, checked } = e.target;
      setPlaceholders((prevPlaceholders) => {
        return prevPlaceholders.map((obj) => {
          if (obj?.name === name) {
            return {
              ...obj,
              checked: checked,
            };
          }
          return obj; // Return unmodified objects
        });
      });
    };
  
    /**save signed pdf*/
    const onSubmitButton = async () => {
      try {
        let data = {
          placeholders: placeholders,
          signingOrder: inputFields,
          _id: getCookie("templateId"),
          viewers: recipientEmails,
          selectedAction: selectedAction,
        };
        const responseUpdateTemplate = await  updateTemplate(data)
        if (responseUpdateTemplate.status === 200) {
          setOpen(false)
          navigate('/templates/manage')
          showSuccess("Submitted successfully!");
          
        } else {
          showError("Error while submitting form");
        }
      } catch (error) {
        showError("Error while submitting form");
      }
    };
  
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="css-79ws1d-MuiModal-root"
      >
        <div
          className={classes.root}
          style={{
            display: "flex",
            width: "100%",
            "max-width": "1260px",
            background: "#fff",
            boxShadow: "0 5px 24px rgba(53,135,182,.22)",
            "border-radius": "8px",
            height: "90vh",
            "max-height": "1085px",
            "min-width": "1100px",
          }}
        >
        <Header onlyPreviewDocument={onlyPreviewDocument}
                   updatedPdf={updatedPdf}
                   classes={classes}
                   decreasePage={decreasePage}
                   increasePage={increasePage}
                   pageNumber={pageNumber}
                   numPages={numPages}
                   zoomPercentage={zoomPercentage}
                   handleZoomChange={handleZoomChange}
                   handleClose={handleClose}
                   actionMenu={actionMenu}
                   otherSignerEmail={otherSignerEmail}
                   onSubmitButton={onSubmitButton} 
                   />            
          <Grid
            container
            spacing={0}
            className="css-11lq3yg-MuiGrid-root"
            style={{
              height: "80%",
              overflow: "scroll",
              paddingTop: "0",
            }}
          >
                  <Grid item xs={12} md={3}>
                     <Field
                               signTextRender={signTextRender}
                               generateSignature={generateSignature}
                               signOpen={signOpen}
                               drag={drag}/> 
                  </Grid>     
        
              <Grid item xs={12} md={7}>
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
                      overflow: "scroll",
                    }}
                  >
                    {placeholders?.map((item, index) => {
                      console.log("item", item);
                      if(item.pageNumber===pageNumber){
                        console.log("item condition:",item)
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
                                  onChangeDatePickerHandller
                                }
                                signerName={item?.signerName}
                                src={item?.itemSign?.src}
                                key={index}
                                item={item}
                                filledText={
                                  item.filledText ? item.filledText : false
                                }
                                onChangeCheckBoxHandller={
                                  onChangeCheckBoxHandller
                                }
                                onChangeTextHandller={onChangeTextHandller}
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
                                    onClick={handlePopoverClick}
                                    variant="contained"
                                    draggable="true"
                                    onDragStart={(ev) => drag(ev, item)}
                                    aria-describedby="simple-popover"
                                  >
                                    <img
                                      src={item?.itemSign?.src}
                                      alt="React Logo"
                                    />{" "}
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
                                            <ListItemText
                                              primary={itemEmail?.name}
                                            />
                                          </ListItem>
                                        );
                                      })}
                                      <ListItem
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          onChangeSignerHandller(
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
                                      minHeight:'20px',
                                      zIndex: "999",
                                      cursor: "grab",
                                      padding: "5px",
                                      backgroundColor: "transparent",
                                      overflowWrap: 'break-all',
                                      wordWrap: 'break-all',
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
                                      onChangeDatePickerHandller(date, item.name)
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
                                    handleInputChange={onChangeTextHandller} 
                                    placeholder={'TextBox'}
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
                                    onChange={onChangeCheckBoxHandller}
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
                                }else{
                                  return null
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
                  </div>
                </div>
              </Grid>
          
          
              <Grid item xs={12} md={2}>
                <div
                  className="pdf-container"
                  style={{
                    marginTop: "15px",
                    height: "80%",
                    overflow: "scroll",
                    "margin-left": "30px",
                  }}
                >
                  <p>
                    Page {pageNumber} of {numPages}
                  </p>
                  <div
                    className="thumbnail-container"
                    style={{ "margin-right": "20px" }}
                  >
                    {thumbnails}
                  </div>
                </div>
              </Grid>
           
          </Grid>
        </div>
      </Modal>
    );
}

export default Index;