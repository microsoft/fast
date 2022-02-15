import { Readable } from "stream";
import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";

const __dirname = path.resolve(path.dirname(""));
const PORT = 8080;
function handleRequest(req: Request, res: Response) {
    res.set("Content-Type", "text/html");
    const stream = (Readable as any).from("hello world");
    stream.on("readable", function (this: any) {
        let data: string;

        while ((data = this.read())) {
            res.write(data);
        }
    });

    stream.on("close", () => res.end());
    stream.on("error", (e: Error) => {
        console.error(e);
        process.exit(1);
    });
}

function handleStyleRequest(req: Request, res: Response) {
    res.set("Content-Type", "text/html");
    fs.readFile(
        path.resolve(__dirname, "./src/fast-style/index.fixture.html"),
        { encoding: "utf8" },
        (err, data) => {
            const stream = (Readable as any).from(data);
            stream.on("readable", function (this: any) {
                while ((data = this.read())) {
                    res.write(data);
                }
            });
            stream.on("close", () => res.end());
            stream.on("error", (e: Error) => {
                console.error(e);
                process.exit(1);
            });
        }
    );
}

function handleStyleScriptRequest(req: Request, res: Response) {
    res.set("Content-Type", "application/javascript");
    fs.readFile(
        path.resolve(__dirname, "./dist/fast-style/index.js"),
        { encoding: "utf8" },
        (err, data) => {
            const stream = (Readable as any).from(data);
            stream.on("readable", function (this: any) {
                while ((data = this.read())) {
                    res.write(data);
                }
            });
            stream.on("close", () => res.end());
            stream.on("error", (e: Error) => {
                console.error(e);
                process.exit(1);
            });
        }
    );
}

const app = express();
app.get("/", handleRequest);
app.get("/fast-style", handleStyleRequest);
app.get("/fast-style.js", handleStyleScriptRequest);
app.listen(PORT);
