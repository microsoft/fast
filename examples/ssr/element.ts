import { css, customElement, FASTElement, html } from "@microsoft/fast-element";

@customElement({
    name: "fast-element",
    template: html`
        <h1>Hello world</h1>
    `,
    styles: css`
        :host {
            display: "block";
        }
    `,
})
export class MyElement extends FASTElement {}
