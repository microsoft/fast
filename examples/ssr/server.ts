/* eslint-disable */
import { render } from "@lit-labs/ssr/lib/render-with-global-dom-shim.js";
import { ElementRenderer } from "@lit-labs/ssr/lib/element-renderer";
import { Readable } from "stream";
import { html } from "lit";

function myTemplate() {
    return html`
        <my-element>foo</my-element>
    `;
}

const templateResult = myTemplate();
const ssrResult = render(templateResult);
const stream = (Readable as any).from(ssrResult);

stream.on("readable", function (this: any) {
    let data;

    while ((data = this.read())) {
        console.log(data);
    }
});
stream.on("close", () => process.exit(0));
stream.on("error", () => process.exit(1));
