/* eslint-env node */
import express from "express";

const PORT = process.env.PORT ?? 6007;

const app = express();

// host public folder
app.use(express.static("test/public"));

// run server
app.listen(PORT);
