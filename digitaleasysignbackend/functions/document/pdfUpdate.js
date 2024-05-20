const { PDFDocument, rgb } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const axios = require("axios").default;
const { generateCheckboxImage } = require("./generateCheckBoxImage");
const path = require("path");
const fs = require("fs");
const Redable = require("stream");
/**This function for pdf update */
async function updatePdf(pdfData, placeholders) {
  if (!pdfData) {
    console.error("PDF data is missing or invalid");
    return {
      status: 400,
      data: "",
      messsage: "PDF data is missing or invalid",
    };
  }
  const existingPdfBytes = pdfData; // Assuming pdfData is a Uint8Array or similar
  try {
    if (!(existingPdfBytes instanceof Uint8Array)) {
      throw new Error("Invalid PDF data type");
    }
    // registerFontkit();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const [pages] = pdfDoc.getPages();

    // load font and embed it to pdf document
    const mistralFontBytes = fs.readFileSync(
      path.join(__dirname, "../../fontFamily/MISTRAL.ttf")
    );
    const rageFontBytes = fs.readFileSync(
      path.join(__dirname, "../../fontFamily/RAGE.TTF")
    );
    const documentSignBytes_1 = fs.readFileSync(
      path.join(__dirname, "../../fontFamily/1_Docusign.ttf")
    );
    const documentSignBytes_2 = fs.readFileSync(
      path.join(__dirname, "../../fontFamily/2_Docusign.ttf")
    );
    const documentSignBytes_3 = fs.readFileSync(
      path.join(__dirname, "../../fontFamily/3_Docusign.ttf")
    );
    const documentSignBytes_4 = fs.readFileSync(
      path.join(__dirname, "../../fontFamily/4_Docusign.ttf")
    );
    const documentSignBytes_5 = fs.readFileSync(
      path.join(__dirname, "../../fontFamily/5_Docusign.ttf")
    );
    const documentSignBytes_6 = fs.readFileSync(
      path.join(__dirname, "../../fontFamily/6_Docusign.ttf")
    );
    const documentSignBytes_7 = fs.readFileSync(
      path.join(__dirname, "../../fontFamily/7_Docusign.ttf")
    );
    const documentSignBytes_8 = fs.readFileSync(
      path.join(__dirname, "../../fontFamily/8_Docusign.ttf")
    );
    const arialFontBytes = fs.readFileSync(
      path.join(__dirname, "../../fontFamily/Arial.TTF")
    );

    const mistralFonts = await pdfDoc.embedFont(mistralFontBytes);
    const rageFonts = await pdfDoc.embedFont(rageFontBytes);
    const documentSignFonts_1 = await pdfDoc.embedFont(documentSignBytes_1);
    const documentSignFonts_2 = await pdfDoc.embedFont(documentSignBytes_2);
    const documentSignFonts_3 = await pdfDoc.embedFont(documentSignBytes_3);
    const documentSignFonts_4 = await pdfDoc.embedFont(documentSignBytes_4);
    const documentSignFonts_5 = await pdfDoc.embedFont(documentSignBytes_5);
    const documentSignFonts_6 = await pdfDoc.embedFont(documentSignBytes_6);
    const documentSignFonts_7 = await pdfDoc.embedFont(documentSignBytes_7);
    const documentSignFonts_8 = await pdfDoc.embedFont(documentSignBytes_8);
    const arialFonts = await pdfDoc.embedFont(arialFontBytes);

    // Update text content
    placeholders?.map(async (item, index) => {
      const id = item.itemSign.id;
      // Check if there is an image URL
      if (
        (id === "sign" || id === "initial") &&
        item.signatureDataUrl &&
        !item.filledText
      ) {
        try {
          const response = await axios.get(item.signatureDataUrl, {
            responseType: "arraybuffer",
          });

          const imageBytes = Buffer.from(response.data);
          const image = await pdfDoc.embedPng(imageBytes);
          const height = 56;
          const width = 100;
          // Draw the image on the page
          pages.drawImage(image, {
            x: item.left,
            y: pages.getHeight() - item.top - height,
            width: width,
            height: height,
          });
        } catch (error) {
          return {
            status: 400,
            data: error,
            messsage: "Error fetching or embedding image",
          };
        }
      }

      if (id === "checkbox") {
        try {
          const imgUrl = await generateCheckboxImage(item.checked);
          const response = await axios.get(imgUrl, {
            responseType: "arraybuffer",
          });
          const imageBytes = Buffer.from(response.data);
          const image = await pdfDoc.embedPng(imageBytes);
          const height = 20;
          const width = 20;
          // Draw the image on the page
          pages.drawImage(image, {
            x: item.left,
            y: pages.getHeight() - item.top - height,
            width: width,
            height: height,
          });
        } catch (error) {
          console.log("error", error);
          return {
            status: 400,
            data: error,
            messsage: "Error fetching or embedding image",
          };
        }
      } else {
        const id = item?.itemSign?.id;
        const date = new Date(item?.date);
        let textUpdate =
          id === "sign" || id === "initial"
            ? item?.filledText
            : id === "text"
            ? item?.text
            : id === "date"
            ? `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
            : "";

        /***update text on pdf***/
        pages.drawText(textUpdate || "", {
          x: item.left,
          y: pages.getHeight() - item.top,
          size: 12,
          font:
            item.fontFamily === "Rage"
              ? rageFonts
              : item.fontFamily === "Mistral"
              ? mistralFonts
              : item.fontFamily === `"1_Docusign"`
              ? documentSignFonts_1
              : item.fontFamily === `"2_Docusign"`
              ? documentSignFonts_2
              : item.fontFamily === `"3_Docusign"`
              ? documentSignFonts_3
              : item.fontFamily === `"4_Docusign"`
              ? documentSignFonts_4
              : item.fontFamily === `"5_Docusign"`
              ? documentSignFonts_5
              : item.fontFamily === `"6_Docusign"`
              ? documentSignFonts_6
              : item.fontFamily === `"7_Docusign"`
              ? documentSignFonts_7
              : item.fontFamily === `"8_Docusign"`
              ? documentSignFonts_8
              : arialFonts,
          color: rgb(0, 0, 0), // Black color
        });
      }
    });

    // Serialize the updated PDF
    const updatedPdfBytes = await pdfDoc.save();

    return {
      status: 200,
      data: updatedPdfBytes,
      messsage: "pdf updated successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      data: error,
      messsage: "Error loading or updating the PDF",
    };
  }
}
module.exports = { updatePdf };
