const express = require("express");
const router = express.Router();

const { addSignature } = require("../controller/sign/addSignature");
const { deleteSignature } = require("../controller/sign/deleteSignature");
const { editSignature } = require("../controller/sign/editSignature");

// Add Signature
router.post("/addSignature", addSignature);

// Delete Signature by ID
router.delete("/deleteSignature/:id", deleteSignature);

// Edit Signature by ID
router.put("/editSignature/:id", editSignature);

module.exports = router;
