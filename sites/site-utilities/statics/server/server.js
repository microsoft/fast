var express = require("express");
var fallback = require("express-history-api-fallback");
var helmet = require("helmet");
var path = require("path");

// Create application
var app = express();

// Security enhancements provided by https://github.com/helmetjs/helmet
app.use(helmet());

// Set public directory
var publicDir = path.resolve(__dirname);

// Set static application options
app.use("/", express.static(publicDir), { maxAge: "3d" });

// Set fallback application options
app.use(fallback("index.html", { root: publicDir }));

// Serve up application on specified port
var port = process.env.PORT || 7001;
app.listen(port);
