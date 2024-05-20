import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Resizable } from 're-resizable';

const CustomTextField = ({
  handleInputChange,
  inputValue,
  defaultValue,
  name,
  placeholder,
  className
}) => {
  const [size, setSize] = React.useState({ width: 150, height: 'auto' });
  const inputRef = React.useRef(null);
  const resizeObserverRef = React.useRef(null);

  const handleResize = (event, direction, ref, d) => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect(); // Detach the ResizeObserver temporarily
    }

    if (ref.offsetWidth >= 100) {
      setSize({ width: ref.offsetWidth, height: 'auto' });
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      }
    }

    if (resizeObserverRef.current) {
      setTimeout(() => {
        resizeObserverRef.current.observe(ref); // Reattach the ResizeObserver after a short delay
      }, 100);
    }
  };

  React.useEffect(() => {
    if (inputRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        // Handle ResizeObserver changes here if needed
      });

      resizeObserverRef.current.observe(inputRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);
  let fontSize = Math.max(size.width / 10, 10);

  const handleInputChangeWithResize = (event) => {
    handleInputChange(event);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
       
    }
  };

 
  return (
    <Resizable
      size={size}
      style={{
       // border: '1px dashed lightgray',
        fontSize: `${fontSize}px`,
        padding: '2px',
        minWidth: 100,
        color:'#2196f3'
      }}
      onResize={handleResize}
    >
      <TextField
        id="custom-textfield"
        variant="standard"
        multiline
        className={className}
        rows={1}
        defaultValue={defaultValue}
        placeholder={placeholder}
        name={name}
        value={inputValue}
        onChange={handleInputChangeWithResize}
        inputRef={inputRef}
        style={{
          width: '100%',
          resize: 'none',
          minHeight: '20px',
          overflowY: 'auto'
        }}
        InputProps={{
          style: { minHeight: '20px', overflow: 'hidden', width: '100%', fontSize: 'inherit',color:'inherit' },
          disableUnderline: true,
        }}
      />
    </Resizable>
  );
};

export default CustomTextField;
