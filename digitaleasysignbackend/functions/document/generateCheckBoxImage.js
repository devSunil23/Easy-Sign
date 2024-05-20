const { createCanvas } = require("canvas");

async function generateCheckboxImage(checked) {
  // Create a canvas
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext("2d");

  // Draw a checkbox icon based on the 'checked' parameter
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillRect(0, 0, 100, 100);

  ctx.strokeStyle = "rgb(0, 0, 0)";
  ctx.lineWidth = 5;

  // Draw the checkbox border
  ctx.strokeRect(10, 10, 80, 80);

  if (checked) {
    // Draw a checkmark if checked
    ctx.beginPath();
    ctx.moveTo(20, 50);
    ctx.lineTo(40, 70);
    ctx.lineTo(80, 30);
    ctx.stroke();
  }

  // Convert the canvas to a data URL
  const dataUrl = canvas.toDataURL();

  return dataUrl;
}

module.exports = { generateCheckboxImage };
