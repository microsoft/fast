var express = require("express");
var app = express();
var path = require("path");
var PORT = 3000;

app.use(express.static(path.join(__dirname, "www")));

app.listen(PORT, err => {
    if (err) {
        throw err;
    }
});
