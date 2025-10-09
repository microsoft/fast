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
    res.set("Content-Security-Policy", "trusted-types fast-html");
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
app.get("/children", (req: Request, res: Response) =>
    handlePathRequest(
        "./src/fixtures/children/children.fixture.html",
        "text/html",
        req,
        res
    )
);
app.get("/children/main.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/children/main.js", "text/javascript", req, res)
);
app.get("/children/bundle.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/children/bundle.js", "text/javascript", req, res)
);
app.get("/dot-syntax", (req: Request, res: Response) =>
    handlePathRequest(
        "./src/fixtures/dot-syntax/dot-syntax.fixture.html",
        "text/html",
        req,
        res
    )
);
app.get("/dot-syntax/main.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/dot-syntax/main.js", "text/javascript", req, res)
);
app.get("/dot-syntax/bundle.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/dot-syntax/bundle.js", "text/javascript", req, res)
);
app.get("/observer-map", (req: Request, res: Response) =>
    handlePathRequest(
        "./src/fixtures/observer-map/observer-map.fixture.html",
        "text/html",
        req,
        res
    )
);
app.get("/observer-map/main.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/observer-map/main.js", "text/javascript", req, res)
);
app.get("/observer-map/bundle.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/observer-map/bundle.js", "text/javascript", req, res)
);
app.get("/partial", (req: Request, res: Response) =>
    handlePathRequest(
        "./src/fixtures/partial/partial.fixture.html",
        "text/html",
        req,
        res
    )
);
app.get("/partial/main.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/partial/main.js", "text/javascript", req, res)
);
app.get("/partial/bundle.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/partial/bundle.js", "text/javascript", req, res)
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
app.get("/ref", (req: Request, res: Response) =>
    handlePathRequest("./src/fixtures/ref/ref.fixture.html", "text/html", req, res)
);
app.get("/ref/main.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/ref/main.js", "text/javascript", req, res)
);
app.get("/ref/bundle.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/ref/bundle.js", "text/javascript", req, res)
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
app.get("/slotted", (req: Request, res: Response) =>
    handlePathRequest(
        "./src/fixtures/slotted/slotted.fixture.html",
        "text/html",
        req,
        res
    )
);
app.get("/slotted/main.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/slotted/main.js", "text/javascript", req, res)
);
app.get("/slotted/bundle.js", (req: Request, res: Response) =>
    handlePathRequest("./server/dist/slotted/bundle.js", "text/javascript", req, res)
);
app.get("/lifecycle-callbacks", (req: Request, res: Response) =>
    handlePathRequest(
        "./src/fixtures/lifecycle-callbacks/lifecycle-callbacks.fixture.html",
        "text/html",
        req,
        res
    )
);
app.get("/lifecycle-callbacks/main.js", (req: Request, res: Response) =>
    handlePathRequest(
        "./server/dist/lifecycle-callbacks/main.js",
        "text/javascript",
        req,
        res
    )
);
app.listen(PORT);
