require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 8000;

app.use(express.json());

// .well-known support for SSL don't edit
app.use("/.well-known", express.static("./.well-known"));

//CONNECT WITH DB
const mongoDB = process.env.MONGO_URL;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function cb() {
    console.log("Successfully connected to database ");
});

// Configure CORS with allowed origins
app.use(cors());

//IMPORT ROUTES
var documentRouter = require("./routes/documentRoute");
var proxyRouter = require("./routes/proxyRoute");
var templateRouter = require("./routes/templateRouter");
var signRoute = require("./routes/signRoute");

// Routers
app.use("/proxy", proxyRouter);
app.use("/document", documentRouter);
app.use("/template", templateRouter);
app.use("/signatures", signRoute);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
