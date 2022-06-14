import express from "express";
import "@microsoft/fast-ssr/install-dom-shim";
import fastSSR from "@microsoft/fast-ssr";
import { html } from "@microsoft/fast-element";
import "fast-ssr";

const app = express();
const port = 8080;
const { templateRenderer, defaultRenderInfo } = fastSSR();

app.get("/", (req, res) => {
    const stream = templateRenderer.render(
        html`
            <chat-bubble :content=${() => ["Hello world"]}></chat-bubble>
            <chat-bubble
                author="external"
                :content=${() => ["goodbye world"]}
            ></chat-bubble>
        `,
        defaultRenderInfo
    );

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
