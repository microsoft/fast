/* eslint-disable */
import { html } from "lit";
import { html as fhtml, when, repeat } from "@microsoft/fast-element";
import * as Components from "./components";
import exp from "constants";
Components;

export function myTemplate() {
    return html`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <title>FAST SSR Demo</title>
            </head>
            <body>
                <fast-main>child content</fast-main>
                <fast-slot>Light dom slotted leaf<fast-leaf></fast-slot></fast-leaf>
            </body>
        </html>
    `;
}

export function myViewTemplate() {
    /*html*/
    return fhtml`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <title>FAST SSR Demo</title>
            </head>
            <body>
                <p :property-bind=${x => "property bind"}></p>
                <p attribute-bind=${x => "attribute bind"}></p>
                <!-- when directive -->
                ${when(x => true, fhtml``)}

                <!-- repeat directive -->
                ${repeat(x => [1, 2, 3], fhtml``)}
            </body>
        </html>
    `;
}
