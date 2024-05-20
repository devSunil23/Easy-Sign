const mongoose = require("mongoose");
const documentSchema = mongoose.Schema;
let Document = new documentSchema(
    {
        fileName: String,
        fileId: String,
        fileSize: String,
        mimetype: String,
        placeholders: Array,
        signingOrder: Array,
        viewers: Array,
        status: {
            type: String,
            default: "Draft",
        },
        userId: String,
        userName: String,
        signatures: Array,
        selectedAction: String,
        documentType: {
            type: String,
            default: "Documents",
        },
        folderId: {
            type: String,
            required: false,
        },
        completedAt: {
            type: { type: Date, required: false },
        },
    },
    {
        timestamps: true, // Add timestamps option
    }
);

module.exports = mongoose.model("Document", Document);
