import React from 'react';

const DragDropFile = () => {
    // drag state
    const [dragActive, setDragActive] = React.useState(false);
    // ref
    const inputRef = React.useRef(null);
    
    // handle drag events
    const handleDrag = function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };
    
    // triggers when file is dropped
    const handleDrop = function(e) {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files);
      }
    };
    
    // triggers when file is selected with click
    const handleChange = function(e) {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files);
      }
    };
    
  // triggers the input when the button is clicked
    const onButtonClick = () => {
      inputRef.current.click();
    };
    
    return (
        <div className={page}>
            <form style={form_file_upload} onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
            <input ref={inputRef} type="file" style={input_file_upload} multiple={true} onChange={handleChange} />
            <label style={label_file_upload} htmlFor="input-file-upload" className={dragActive ? {drag_active} : "" }>
                <div>
                <p>Drag and drop your file here or</p>
                <button style={upload_button} onClick={onButtonClick}>Upload a file</button>
                </div> 
            </label>
            { dragActive && <div style={drag_file_element} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
            </form>
        </div>
    );
};

function handleFile(files) {
    alert("Number of files: " + files.length);
}  
const page = { 
    "display": "flex",
    "minHeight": "100vh",
    "flex-direction": "column",
    "justify-content": "center",
    "align-items": "center"  
}

const form_file_upload = { 
    "height": "16rem",
    "width": "28rem",
    "max-width": "100%",
    "text-align": "center",
    "position": "relative",
}
const label_file_upload = { 
    "height": "100%",
    "display": "flex",
    "align-items": "center",
    "justify-content": "center",
    "border-width": "2px",
    "border-radius": "1rem",
    "border-style": "dashed",
    "border-color": "#cbd5e1",
    "backgroundColor": "#f8fafc",
}
const drag_active = { 
    "backgroundColor": "#ffffff"
}
const input_file_upload = { 
    "display": "none"
}
const upload_button = { 
    "cursor": "pointer",
    "padding": "0.25rem",
    "font-size": "1.4rem",
    "border": "none",
    "font-family": 'Oswald',
    "backgroundColor": "transparent",
    '--hover-color':'blue'
}
const drag_file_element = { 
    "position": "absolute",
    "width": "100%",
    "height": "100%",
    "border-radius": "1rem",
    "top": "0px",
    "right": "0px",
    "bottom": "0px",
    "left": "0px"
}


export default DragDropFile;