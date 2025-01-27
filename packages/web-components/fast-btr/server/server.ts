import fs from "fs";
import path from "path";
import { Readable } from "stream";

import express, { Request, Response } from "express";

const __dirname = path.resolve(path.dirname(""));
const PORT = 8080;

function handlePathRequest(
    mapPath: string,
    contentType: string,
    req: Request,
    res: Response
) {
    res.set("Content-Type", contentType);
    fs.readFile(path.resolve(__dirname, mapPath), { encoding: "utf8" }, (err, data) => {
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
    });
}

const app = express();
app.get("/binding", (req: Request, res: Response) =>
    handlePathRequest("./src/fixtures/binding.fixture.html", "text/html", req, res)
);
app.listen(PORT);
