// Probabily have no use

const mongoose = require("mongoose");
const signatureSchema = mongoose.Schema;
let Signature = new signatureSchema({
    signature: String,
    signatureType: String,
    userId: String,
    documentId: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Signature", Signature);
