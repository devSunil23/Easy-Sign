import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Grid from "@mui/material/Grid";
import "react-pdf/dist/esm/Page/TextLayer.css";
import Modal from "@mui/material/Modal";
import "../../style/pdfPreview.css";
import SignLogo from "../../style/sign.svg";
import CheckboxLogo from "../../style/checkbox.svg";
import DateLogo from "../../style/date.svg";
import InitalsLogo from "../../style/initals.svg";
import TextLogo from "../../style/text.svg";
import { getCookie, setCookie } from "../../utilities/cookies";
import { useMessage } from "../Header/Header";
import axios from "axios";
import { env } from "../../utilities/function";
import SignedFinalStep from "./SignedFinalStep";
import { useDispatch, useSelector } from "react-redux";
import { selectSignatureiD } from "../../store/action";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import DocumentActivity from "../DocumentActivity/DocumentActivity";
import Header from "./Header";
import BreadcrumbsTable from "./BreadcrumbsTable";
import Action from "./Action";
import Fields from "./Fields";
import Placeholders from "./Placeholders";
import useStyles from "./Style";
import { Typography,Box, Paper } from "@mui/material";
// import PopoverComponent from "./PopoverComponent";
// Configure PDF.js worker path for the library to work
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Index = ({
    pdfFile,
    documentData,
    onlyPreviewDocument,
    otherSignerEmail,
    userEmail,
}) =>{
    const classes = useStyles();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [zoomPercentage, setZoomPercentage] = useState(100); // Default zoom is 75%
    const [actionMenu, setActionMenu] = React.useState(false);
    const [signOpen, setSignOpen] = React.useState(false);
    const [selectedAction, setSelectedAction] = useState("yourself");
    const [inputFieldOrder, setInputFieldOrder] = useState([0]);
    const [open, setOpen] = React.useState(true);
    const [currentPlaceholder,setCurrentPlaceholder] = useState(null);
    const [inputFields, setInputFields] = useState([
      {
        name: "",
        email: "",
        status: "pending",
        viewedDates: [],
        actionDate: new Date(),
      },
    ]);
    const [recipientEmails, setRecipientEmails] = useState([]);
    const [placeholders, setPlaceholders] = useState([]);
    const { showError, showSuccess } = useMessage();
    const dispatch = useDispatch();
    const [emailError, setEmailError] = useState(false);
    const [updatedPdf, setUpdatedPdf] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handlePopoverClick = (event,item) => {
      console.log('handlePopoverClick------------>',item)
      setAnchorEl(event.currentTarget);
      setCurrentPlaceholder(item)
    };
  
    const handlePopoverClose = () => {
      console.log('handlePopoverClose------------>')

      setAnchorEl(null);
    };
  
    const handleAddInputField = () => {
      console.log('handleAddInputField------------>')

      setInputFields((prevInputFields) => [
        ...prevInputFields,
        {
          name: "",
          email: "",
          status: "pending",
          viewedDates: [],
          actionDate: new Date(),
        },
      ]);
      setInputFieldOrder((prevOrder) => [...prevOrder, inputFields.length]);
    };
  
    const handleDeleteCurrentPlaceholder = ()=>{
      console.log('Handle delete current placeholder------------->')
      console.log(currentPlaceholder)
      const filterPlaceholder = placeholders.filter((item)=>item!==currentPlaceholder)
      console.log("filterPlaceholder",filterPlaceholder)
      setPlaceholders(filterPlaceholder)
      if(filterPlaceholder.length===0)
      {
        setCurrentPlaceholder(null)
      }else{

        setCurrentPlaceholder(filterPlaceholder[0])
      }
    }
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
    const handleRemoveInputField = (indexToRemove) => {
      console.log('handleRemoveInputField------------>')

      if (inputFields.length === 1 || indexToRemove === 0) {
        // Ensure that at least one input field remains
        return;
      }
  
      setInputFields((prevInputFields) =>
        prevInputFields.filter((_, index) => index !== indexToRemove)
      );
      setInputFieldOrder((prevOrder) =>
        prevOrder.filter((index) => index !== indexToRemove)
      );
  
      // If all fields are removed, add an empty field to ensure at least one field is present
      if (inputFields.length === 1) {
        setInputFields([
          {
            name: "",
            email: "",
            status: "pending",
            viewedDates: [],
            actionDate: new Date(),
          },
        ]);
        setInputFieldOrder([0]);
      }
    };
  
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
  
    const handleInputFieldOrderChange = (result) => {
      console.log('handleInputFieldOrderChange------------>')
      
      if (!result.destination) return;
      const updatedOrder = [...inputFieldOrder];
      const [movedField] = updatedOrder.splice(result.source.index, 1);
      updatedOrder.splice(result.destination.index, 0, movedField);
  
      setInputFieldOrder(updatedOrder);
    };
  
    const handleInputChange = (index, event) => {
      console.log('handleInputChange------------>')

      const { name, value } = event.target;
      const newInputFields = [...inputFields];
      newInputFields[index][name] = value;
      setInputFields(newInputFields);
    };
  
    const handleClose = (event, reason) => {
      if (reason && reason === "backdropClick") return;
      setOpen(false);
      navigate("/documents");
  
      // window.location.reload(); //this is reload when close modal
    };
  
    const handleAddRecipient = () => {
      setRecipientEmails([...recipientEmails, ""]);
    };
  
    const handleRemoveRecipient = (indexToRemove) => {
      setRecipientEmails((prevEmails) =>
        prevEmails.filter((_, index) => index !== indexToRemove)
      );
    };
  
    const handleRecipientChange = (index, event) => {
      const { value } = event.target;
      const newEmails = [...recipientEmails];
      newEmails[index] = value;
      setRecipientEmails(newEmails);
      setEmailError(!validateEmail(value));
    };
  
    /**This is for breacrumb choose handller */
    const signatureChooseHandller = () => {
      setActionMenu(!actionMenu);
      setUpdatedPdf(false);
    };
  
    /**This function for save signed files handller */
    const signedOnClickHandller = () => {
      setUpdatedPdf(false);
    };
    /***************email validation test*************/
  
    const validateEmail = (email) => {
      // A simple email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
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
      if (documentData) {
        setActionMenu(true);
        if (
          window.location.pathname === "/otherSinger"
            ? true
            : getCookie("userId") === documentData.userId
        ) {
          console.log("documentData", documentData);
          if (documentData._id !== null || documentData._id !== undefined) {
            setCookie("documentId", documentData._id);
          }
          setSelectedAction(documentData.selectedAction);
          setPlaceholders(documentData.placeholders);
          setRecipientEmails(documentData.viewers);
          setInputFields(documentData.signingOrder);
          let tempSigningOrder = [];
          documentData?.signingOrder?.map((_, index) => {
            return tempSigningOrder.push(index);
          });
          setInputFieldOrder(tempSigningOrder);
          // setTimeout(() => {
          //   documentData.placeholders.forEach((placeholder) => {
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
  
    // function allowDrop(ev) {
    //   ev.preventDefault();
    //   ev.dataTransfer.dropEffect = "move";
    // }
  
    // const drag = (ev) => {
    //   ev.dataTransfer.setData("text", ev.target.id);
    //   // Record the initial mouse coordinates relative to the element
    //   const offsetX = ev.clientX - ev.target.getBoundingClientRect().left;
    //   const offsetY = ev.clientY - ev.target.getBoundingClientRect().top;
  
    //   // Set the drag image to be the element itself
    //   ev.dataTransfer.setDragImage(ev.target, offsetX, offsetY);
  
    //   // Store the initial mouse coordinates as data attributes on the element
    //   ev.target.setAttribute("data-offset-x", offsetX);
    //   ev.target.setAttribute("data-offset-y", offsetY);
    // };
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
    // function drop(ev) {
    //   ev.preventDefault();
    //   const data = ev.dataTransfer.getData("text");
    //   const draggged = document.getElementById(data);
    //   const scaleFactor = zoomPercentage / 100;
    //   // const clone = draggged.cloneNode(true);
    //   // draggged.setAttribute("id", Math.floor(Math.random() * 1001));
    //   // document.getElementById("buttonsID").appendChild(clone);
  
    //   draggged.style.width = "100px";
  
    //   document.getElementById("divd1").appendChild(draggged);
    //   // Retrieve the initial mouse coordinates from data attributes
    //   const offsetX = parseInt(draggged.getAttribute("data-offset-x"), 10);
    //   const offsetY = parseInt(draggged.getAttribute("data-offset-y"), 10);
  
    //   // Calculate the offset values for the new position (e.g., relative to a parent container)
    //   const parentElement = draggged.parentElement;
    //   const parentRect = parentElement.getBoundingClientRect();
  
    //   // Calculate the new position based on the current mouse coordinates
    //   const left = (ev.clientX - offsetX - parentRect.left) / scaleFactor;
    //   const top = (ev.clientY - offsetY - parentRect.top) / scaleFactor;
    //   setPlaceholders((prevInputFields) => {
    //     const existingIndex = prevInputFields.findIndex(
    //       (item) => item.name === data
    //     );
  
    //     if (existingIndex !== -1) {
    //       // If the element with the same "name" exists, update it
    //       const updatedInputFields = [...prevInputFields];
    //       updatedInputFields[existingIndex] = {
    //         ...updatedInputFields[existingIndex],
    //         left,
    //         top,
    //       };
    //       return updatedInputFields;
    //     } else {
    //       // If it doesn't exist, create a new element
    //       return [
    //         ...prevInputFields,
    //         { name: data, fontFamily: "arial", text: "", left, top },
    //       ];
    //     }
    //   });
  
    //   // Set the position of the dragged element
    //   draggged.style.position = "absolute";
    //   draggged.style.left = `${left}px`;
    //   draggged.style.top = `${top}px`;
    //   draggged.style.borderColor = "#fa9600";
  
    //   // Clear the data attributes
    //   draggged.removeAttribute("data-offset-x");
    //   draggged.removeAttribute("data-offset-y");
    // }
  
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
          setCurrentPlaceholder(updatedCopiedItems[existingItemIndex])
          return updatedCopiedItems;
        } else {
          // If it doesn't exist, create a new item
          const newPlaceHolder = {
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
            signerType: selectedAction,
            signerEmail: inputFields[0]?.email,
            signerName: inputFields[0]?.name,
            pageNumber: pageNumber,
          };
          setCurrentPlaceholder(newPlaceHolder);
          return [
            ...prevCopiedItems,
              newPlaceHolder,
          ];
        }
      });
      ev.target.removeAttribute("data-offset-x");
      ev.target.removeAttribute("data-offset-y");
    };
  
    function onBTNclick(id) {
      console.log('onBTNclick------------>',id)

      setSignOpen(!signOpen);
      dispatch(selectSignatureiD(id));
    }
    const emptyFunction = (item) => {
      console.log('empty function',item)
    };
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
    const handleAction = () => {
      setActionMenu(true);
    };
    const handleActionChange = (event) => {
      setSelectedAction(event.target.value);
    };
  
    /**update generate signature*/
    const generateSignature = () => {
      console.log('generateSignature------------>')

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
      console.log('onChangeDatePickerHandller------------>')
      
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
      console.log('onChangeSignerHandller------------>')

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
      console.log('onChangeTextHandller------------>')

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
    const onChangeCheckBoxHandller = (e,item) => {
      console.log('onChangeCheckBoxHandller------------>',item)

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
          _id: getCookie("documentId"),
          viewers: recipientEmails,
          selectedAction: selectedAction,
        };
        const responseAddDocument = await axios.post(
          env("BACKEND_SERVER") + "/document/updateDocument",
          // "http://localhost:8005" + "/document/updateDocument",
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: false,
          }
        );
        if (responseAddDocument.data.status === 200) {
          showSuccess("Submited successfully!");
          setUpdatedPdf(true);
        } else {
          showError("Error while submitting form");
        }
      } catch (error) {
        showError("Error while submitting form");
      }
    };
  
    /**send a notification for sign */
  
    // const signADocumentHandller = () => {};
  
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
                                handleClose={handleClose}
                                handleZoomChange={handleZoomChange}
                                actionMenu={actionMenu}
                                otherSignerEmail={otherSignerEmail}
                                onSubmitButton={onSubmitButton}/>
  
          {/**This is show not show when other signer or previewOnly */}
          {!otherSignerEmail && !onlyPreviewDocument && (
            <BreadcrumbsTable signatureChooseHandler={signatureChooseHandller}
                                            actionMenu={actionMenu}
                                            updatedPdf={updatedPdf}
                                            signedOnClickHandler={signedOnClickHandller}/>
          )}
  
          <Grid
            container
            spacing={0}
            className="css-11lq3yg-MuiGrid-root"
            style={{
              height: "80%",
              overflowY: "scroll",
              paddingTop: "0",
            }}
          >
            {updatedPdf
              ? ""
              : !onlyPreviewDocument && (
                  <Grid item xs={12} md={3} sx={{
                    paddingRight:'2rem',
                    //marginLeft:'.5rem',
                    paddingTop:'2rem',
                    height: '100vh', /* 100% of the viewport height */
                    overflowY: 'scroll',
                   }}>
                    {!actionMenu && (
                      <Action selectedAction={selectedAction}
                                                  handleInputFieldOrderChange={handleInputFieldOrderChange}
                                                  inputFieldOrder={inputFieldOrder}
                                                  handleInputChange={handleInputChange}
                                                  handleRemoveInputField={handleRemoveInputField}
                                                  handleAddInputField={handleAddInputField}
                                                  recipientEmails={recipientEmails}
                                                  handleRecipientChange={handleRecipientChange}
                                                  handleRemoveRecipient={handleRemoveRecipient}
                                                  handleAddRecipient={handleAddRecipient}
                                                  handleAction={handleAction}
                                                  handleActionChange={handleActionChange}
                                                  inputFields={inputFields}
                                                  classes={classes}
                                                  emailError={emailError}/>
                    )}
                    {actionMenu && (
                      
                      <Fields  signOpen={signOpen}
                                             signTextRender={signTextRender}
                                             otherSignerEmail={otherSignerEmail}
                                             generateSignature={generateSignature}
                                             drag={drag}
                                             currentPlaceholder={currentPlaceholder}
                                             handleDeleteCurrentPlaceholder={handleDeleteCurrentPlaceholder}/>
                    )}
                  </Grid>
                )}
            {updatedPdf ? (
              ""
            ) : (
              <Grid item xs={12} md={7}>
                
               <Placeholders  placeholders={placeholders}
                                            pageNumber={pageNumber}
                                            onlyPreviewDocument={onlyPreviewDocument}
                                            otherSignerEmail={otherSignerEmail}
                                            handlePopoverClick={handlePopoverClick}
                                            onChangeDatePickerHandler={onChangeDatePickerHandller}
                                            onChangeCheckBoxHandler={onChangeCheckBoxHandller}
                                            onChangeTextHandler={onChangeTextHandller}
                                            drag={drag}
                                            onBTNclick={onBTNclick}
                                            emptyFunction={emptyFunction}
                                            pdfFile={pdfFile}
                                            onPageLoadSuccess={onPageLoadSuccess}
                                            handleOnLoadSuccess={handleOnLoadSuccess}
                                            numPages={numPages}
                                            drop={drop}
                                            handlePopoverClose={handlePopoverClose}
                                            onChangeSignerHandler={onChangeSignerHandller}
                                            inputFields={inputFields}
                                            selectedAction={selectedAction}
                                            classes={classes}
                                            anchorEl={anchorEl}/>
  
                {onlyPreviewDocument && (
                  <Grid>
                    <DocumentActivity documentData={documentData} />
                  </Grid>
                )}
              </Grid>
            )}
            {updatedPdf ? (
              <SignedFinalStep
                pdfFile={pdfFile}
                signedType={selectedAction}
                documentData={documentData}
                handleClose={handleClose}
                otherSignerEmail={otherSignerEmail}
                userEmail={userEmail}
              />
            ) : (
              <Grid item xs={12} md={2} >
                <Typography display={'flex'} justifyContent={'center'}>{`Page(${pageNumber})`}</Typography>
                <Box style={{
                    height: '100vh', /* 100% of the viewport height */
                    overflowY: 'scroll',
                    padding:'.5rem'
                }}>
                  <Box  padding={'1.5rem'}>
                  {thumbnails.map((item,index)=><Paper key={index} elevation={10} className={classes.customPaper}>{item}</Paper>)}

                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </div>
      </Modal>
    );  
}

export default Index;
