/* eslint-disable */
import { html } from "lit";
import { Main } from "./components/main";

Main;

export function myTemplate() {
    return html`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <title>FAST SSR Demo</title>
            </head>
            <body>
                <fast-main>child content</fast-main>
            </body>
        </html>
    `;
}
