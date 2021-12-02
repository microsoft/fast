/* eslint-disable */
import { html } from "lit";
import { html as fhtml, when, repeat } from "@microsoft/fast-element";
import * as Components from "./components";
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
                <p :property-bind=${x => "property bind"}>idl attr binding</p>
                <p attribute-bind=${x => "attribute bind"}>content attr binding</p>
                <p ?boolean-attribute-bind-true=${x =>
                    true}>boolean attr binding: true</p>
                <p ?boolean-attribute-bind-false=${x =>
                    false}>boolean attr binding: false</p>
                <p @click=${() => console.log("foobar")}></p>
                <!-- when directive -->
                ${when(x => true, fhtml``)}

                <!-- repeat directive -->
                ${repeat(x => [1, 2, 3], fhtml``)}
            </body>
        </html>
    `;
}
