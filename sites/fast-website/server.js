/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */
const path = require("path");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const publicDir = path.resolve(__dirname, "dist");

app.use("/", express.static(publicDir));

app.listen(PORT, port => console.log(`Listening on port ${PORT}`));
