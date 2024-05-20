import React from "react";

const DateFormate = ({ localFormate }) => {
  const date = new Date(localFormate);
  return (
    <div>
      {date?.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
    </div>
  );
};

export default DateFormate;
