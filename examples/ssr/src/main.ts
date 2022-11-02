import { customElement, FASTElement, html } from "@microsoft/fast-element";

@customElement({
    name: "my-element",
    template: html`
        Hello world
    `,
})
export class MyElement extends FASTElement {}
