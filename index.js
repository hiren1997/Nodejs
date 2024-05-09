require('./config');
const express = require("express");
const routes = require("./Routes/index")
const app = express();

// const mail = require('./Mail/index'); // Mail send

// const BodyParser = require("body-parser");
// const Bcrypt = require("bcryptjs");
const Port = process.env.PORT;
const mongoose = require("mongoose");

console.log(process.env.DATABASE);

mongoose.connect(process.env.DATABASE);

const db = mongoose.connection;

db.on('error', (error) => {
    console.log(error);
});

db.once('open', () => {
    console.log("Connected to Database");
})

// use for convert res in json
app.use(express.json());

// use for open the image in browser
app.use("/uploads", express.static("./Upload/image")) // "/uploads" is the path of URL to access the image &&&&& "./Upload/image" is the Storage of file path

// use for URL path to start url as localhost:4000/api/......
app.use('/api', routes);

app.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
})