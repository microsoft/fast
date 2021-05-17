var express = require("express");
var path = require("path");

// Create application
var app = express();

// Set public directory
var publicDir = path.resolve(__dirname);

// Set static application options
app.use("/", express.static(publicDir, { maxAge: "0d" }));

// Serve up application on specified port
var port = process.env.PORT || 7001;
app.listen(port);
