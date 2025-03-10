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
app.get("/attribute", (req: Request, res: Response) =>
    handlePathRequest(
        "./src/fixtures/attribute/attribute.fixture.html",
        "text/html",
        req,
        res
    )
);
app.get("/attribute/main.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/attribute/main.js", "text/javascript", req, res)
);
app.get("/event", (req: Request, res: Response) =>
    handlePathRequest("./src/fixtures/event/event.fixture.html", "text/html", req, res)
);
app.get("/event/main.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/event/main.js", "text/javascript", req, res)
);
app.get("/binding", (req: Request, res: Response) =>
    handlePathRequest(
        "./src/fixtures/binding/binding.fixture.html",
        "text/html",
        req,
        res
    )
);
app.get("/binding/main.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/binding/main.js", "text/javascript", req, res)
);
app.get("/when", (req: Request, res: Response) =>
    handlePathRequest("./src/fixtures/when/when.fixture.html", "text/html", req, res)
);
app.get("/when/main.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/when/main.js", "text/javascript", req, res)
);
app.get("/when/bundle.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/when/bundle.js", "text/javascript", req, res)
);
app.get("/repeat", (req: Request, res: Response) =>
    handlePathRequest("./src/fixtures/repeat/repeat.fixture.html", "text/html", req, res)
);
app.get("/repeat/main.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/repeat/main.js", "text/javascript", req, res)
);
app.get("/repeat/bundle.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/repeat/bundle.js", "text/javascript", req, res)
);
app.listen(PORT);
