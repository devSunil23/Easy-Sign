import React from "react";

const ShowStatus = ({ color, backgroundColor, status }) => {
  return (
    <div
      style={{
        marginLeft: 15,
        padding: "2px 8px",
        borderRadius: 20,
        backgroundColor: `${backgroundColor}`, // Customize the color based on status
        color: `${color}`, // Customize the text color
        fontSize: "13px",
        textTransform: "uppercase",
      }}
    >
      {status}
    </div>
  );
};

export default ShowStatus;
