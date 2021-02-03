var express = require("express");
var fallback = require("express-history-api-fallback");
var helmet = require("helmet");
var fs = require("fs");
var path = require("path");

// Create application
var app = express();

app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());

// Set public directory
var publicDir = path.resolve(__dirname);

// Set static application options
app.use("/", express.static(publicDir, { maxAge: "0d" }));

// Set fallback application options
app.use(fallback("index.html", { root: publicDir }));

// Manage search engine crawlers if staging add robots.txt, otherwise delete
if (process.env.WEBSITE_HOSTNAME.indexOf("-stage") > -1) {
    fs.writeFile("robots.txt", "User-agent: *\r\nDisallow: /", function (err) {
        if (err) throw err;
    });
} else {
    fs.unlink("robots.txt", function (err) {
        if (err) throw err;
    });
}

// Serve up application on specified port
var port = process.env.PORT || 7001;
app.listen(port);
