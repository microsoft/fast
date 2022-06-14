import express from "express";
import "@microsoft/fast-ssr/install-dom-shim";
import fastSSR from "@microsoft/fast-ssr";

const app = express();
const port = 8080;
const { templateRenderer, defaultRenderInfo } = fastSSR();

app.get("/", (req, res) => {
    const stream = templateRenderer.render("<h1>Hello World</h1>", defaultRenderInfo);

    res.set({
        "Content-Type": "text/html",
    });

    for (const part of stream) {
        res.write(part);
    }

    res.end();
});

app.listen(port, () => {
    console.log(`SSR example app listening on port ${port}`);
});
