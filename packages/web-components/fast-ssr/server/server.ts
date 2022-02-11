import { Readable } from "stream";
import express, { Request, Response } from "express";

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

const app = express();
app.get("/", handleRequest);
app.listen(PORT);
