// import exp from "constants";
// import express, { Request, Response } from "express";
// import { Server } from "http";
// import { Readable } from "stream";

// const PORT = 8080;
// function handleRequest(req: Request, res: Response) {
//     res.set("Content-Type", "text/html");
//     const stream = (Readable as any).from("");
//     stream.on("readable", function (this: any) {
//         let data: string;

//         while ((data = this.read())) {
//             res.write(data);
//         }
//     });

//     stream.on("close", () => res.end());
//     stream.on("error", (e: Error) => {
//         console.error(e);
//         process.exit(1);
//     });
// }

// const app = express();
// app.get("/", handleRequest);
// const server = app.listen(PORT);
import http from "http";

const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});

proxy.listen('8080')
