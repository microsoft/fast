var express = require("express");
var fallback = require("express-history-api-fallback");
var helmet = require("helmet");
var path = require("path");

// Create application
var app = express();

// Security enhancements provided by https://github.com/helmetjs/helmet
// contentSecurityPolicy() omitted because it breaks modern implementation methods
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

// Set public directory
var publicDir = path.resolve(__dirname);

// Set static application options
app.use("/", express.static(publicDir, { maxAge: "3d" }));

// Set fallback application options
app.use(fallback("index.html", { root: publicDir }));

// Serve up application on specified port
var port = process.env.PORT || 7001;
app.listen(port);
