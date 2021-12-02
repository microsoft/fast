/* eslint-disable */
import express, { Request, Response } from "express";
import "./fast-element-dom-shim";
import { render } from "@lit-labs/ssr/lib/render-lit-html";
import { Readable } from "stream";
import { FASTElementRenderer } from "./element-renderer";
import { myTemplate, myViewTemplate } from "./experience";
import { renderViewTemplate } from "./view-template-renderer";

function handleRequest(req: Request, res: Response) {
    const renderInfo = {
        elementRenderers: [FASTElementRenderer],
        customElementHostStack: [],
        customElementInstanceStack: [],
    };

    const viewTemplateRenderer = renderViewTemplate(
        myViewTemplate(),
        undefined,
        renderInfo
    );
    let currentValue = viewTemplateRenderer.next();
    let output = "";

    while (!currentValue.done) {
        console.log(currentValue.value);
        output = output + currentValue.value;
        currentValue = viewTemplateRenderer.next();
    }

    res.set("Content-Type", "text/html");
    const templateResult = myTemplate();
    const ssrResult = render(templateResult, renderInfo);
    const stream = (Readable as any).from(ssrResult);
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

const port = 8080;
const app = express();
app.get("/", handleRequest);

console.log(`FAST SSR demo started at http://localhost:${port}`);
app.listen(8080);
