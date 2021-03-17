/* eslint-env node */
import path from "path";
import express from "express";

const useLocalServer = process.env.USE_LOCAL !== "false";
const expressPort = process.env.PORT || 7001;

let server;

const app = useLocalServer && express();

if (app) {
    app.use(express.static(path.resolve(__dirname, "public")));
}

export function mochaGlobalSetup() {
    if (!useLocalServer) {
        console.log("Test harness server skipped.");
        return;
    }

    server = app.listen(expressPort, () => {
        console.log(`Test harness server listening on port ${expressPort}`);
    });
}

export async function mochaGlobalTeardown() {
    if (!useLocalServer) {
        return;
    }

    if (server) {
        await server.close();
        console.log(`Test harness server on port ${expressPort} closed`);
    }
}
