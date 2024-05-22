export const downloadFile = (pdfFile, fileName) => {
    if (pdfFile) {
        const a = document.createElement("a");
        a.href = pdfFile;
        a.download = `${fileName}`; // Set your desired file name here
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};
