 
import React from 'react';
import { useDrag } from 'react-dnd';

const SignaturePlaceholder = ({ left, top, onDrop }) => {
  const [, ref] = useDrag({
    type: 'button',
    item: { left, top },
  });

  return (
    <div 

      ref={ref}
      style={{ 
        left,
        top,
        width: '50px',
        height: '20px',
        backgroundColor: 'blue',
        color: 'white',
        textAlign: 'center',
        lineHeight: '20px',
        cursor: 'grab',
      }}
      onClick={() => onDrop(left, top)}
    >
      Button
    </div>
  );
};

export default SignaturePlaceholder;
