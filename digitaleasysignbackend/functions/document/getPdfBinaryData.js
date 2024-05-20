// Register fontkit
const getPdfBinaryData = async (filename, bucket) => {
  // Find the file by filename
  const file = await bucket.find({ filename: filename }).toArray();

  if (file.length === 0) {
    console.log("PDF not found");
    return null;
  }

  // Retrieve the binary data from the file
  const binaryData = await new Promise((resolve, reject) => {
    const chunks = [];
    const downloadStream = bucket.openDownloadStreamByName(filename);

    downloadStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    downloadStream.on("end", () => {
      const binaryData = Buffer.concat(chunks);
      resolve(binaryData);
    });

    downloadStream.on("error", reject);
  });

  return binaryData;
};

module.exports = { getPdfBinaryData };
