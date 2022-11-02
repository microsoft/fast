/* eslint-disable no-undef */
/**
 * 1. Install DOM Shim
 */
import "@microsoft/fast-ssr/install-dom-shim";
import { html } from "@microsoft/fast-element";
import fastSSR from "@microsoft/fast-ssr";
import express from "express";
import "./src/my-element.js";

const app = express();
const port = 8080;

/**
 * 2. SSR renderer Created
 */
const { templateRenderer } = fastSSR();

app.use(express.static("./www"));

const template = html`
    <!DOCTYPE html>
    <html>
        <body>
            <my-element></my-element>
        </body>
    </html>
`;

app.get("/", (req, res) => {
    /**
     * 3. Render the template
     */
    const stream = templateRenderer.render(template);

    for (const part of stream) {
        res.write(part);
    }

    res.end();
});

app.listen(port, () => {
    console.log(`SSR example app listening on port ${port}`);
});
