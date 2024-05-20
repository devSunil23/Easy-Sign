import React, { useEffect } from "react";

const BoxIntegration = ({ onFileSelect, handleCancelFile, boxaccessToken }) => {
  var folderId = "0";
  var accessToken = boxaccessToken;
  var filePicker = new window.Box.FilePicker();

  // Attach event listener for when the choose button is pressed
  filePicker.addListener("choose", function (files) {
    // Pass the selected files to the parent component or perform other actions
    onFileSelect(files);
    filePicker.hide();
  });

  // Attach event listener for when the cancel button is pressed
  filePicker.addListener("cancel", function () {
    handleCancelFile();
  });
  /* eslint-disable */
  useEffect(() => {
    if (filePicker) {
      filePicker.show(folderId, accessToken, {
        container: ".container",
      });
    }
  }, [filePicker]);
  /* eslint-enable */
  return (
    <div
      className="container"
      style={{ height: "500px", width: "800px" }}
    ></div>
  );
};

export default BoxIntegration;
