import "@microsoft/fast-ssr/install-dom-shim";
import { readFileSync } from "fs";
import path from "path";
import { html } from "@microsoft/fast-element";
import { DI, Registration } from "@microsoft/fast-foundation";
import fastSSR from "@microsoft/fast-ssr";
import express from "express";
import "fast-ssr";
import { ChatProvider } from "fast-ssr";

const messages = JSON.parse(
    readFileSync(path.resolve("./message-data.json"), { encoding: "utf-8" }).toString()
);
class NodeJSMessageProvider {
    messages = messages;
    add(message) {
        this.messages.push(message);
    }
}

DI.getOrCreateDOMContainer().register(
    Registration.singleton(ChatProvider, NodeJSMessageProvider)
);

const app = express();
const port = 8080;
const { templateRenderer, defaultRenderInfo } = fastSSR();
app.get("/", (req, res) => {
    const stream = templateRenderer.render(
        html`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    <title>SSR Example</title>
                    <style>
                        body,
                        html {
                            margin: 0;
                        }

                        chat-list {
                            height: 100vh;
                        }
                    </style>
                </head>
                <body>
                    <chat-list></chat-list>
                </body>
            </html>
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
