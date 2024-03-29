import express from "express";

// get port from command line flag --port=xxxx
const PORT = process.argv.find(arg => arg.startsWith("--port="))?.split("=")[1] ?? 9002;

const app = express();

app.use(express.static("test/fixtures"));

app.use("/dist", express.static("dist"));

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
