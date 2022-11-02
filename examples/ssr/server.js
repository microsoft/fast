/* eslint-disable no-undef */
/**
 * 1. Install DOM Shim
 */
import "@microsoft/fast-ssr/install-dom-shim";
import { html } from "@microsoft/fast-element";
import fastSSR from "@microsoft/fast-ssr";
import express from "express";

const app = express();
const port = 8080;

/**
 * 2. SSR renderer Created
 */
const { templateRenderer } = fastSSR();

app.use(express.static("./www"));

const template = html`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>SSR Example</title>
        <body>
            <!--
                Use caution in production environments embedding JSON.
                In general the JSON should be sanitized to prevent
                JSON injection attacks.
            -->
            <script src="/bundle.js" defer></script>
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
