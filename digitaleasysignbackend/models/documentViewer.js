const mongoose = require("mongoose");
const documentSchema = mongoose.Schema;
let OtherViewer = new documentSchema(
    {
        documentId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        viewerAccessToken: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("OtherViewer", OtherViewer);
