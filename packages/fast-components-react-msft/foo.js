const linkify = require("linkify-it")();
const path = require("path");

console.log(
    linkify.match(path.resolve(__dirname, "./api/interfaces/actiontogglehandledprops.md"))
);
