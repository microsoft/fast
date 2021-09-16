import { customElement, FASTElement, html } from "@microsoft/fast-element";

@customElement({
    name: "fast-element",
    template: html`
        <h1>Hello world</h1>
    `,
})
export class MyElement extends FASTElement {}
