const mongoose = require("mongoose");
const documentSchema = mongoose.Schema;
let OtherSigner = new documentSchema({
    documentId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: false,
    },
    signerEmail: {
        type: String,
        required: true,
    },
    signerAccessToken: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: false,
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OtherSigner", OtherSigner);
