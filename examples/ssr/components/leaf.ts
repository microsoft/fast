import { customElement, FASTElement, html } from "@microsoft/fast-element";

@customElement({
    name: "fast-leaf",
    template: html`
        <p>Leaf node</p>
    `,
})
export class Leaf extends FASTElement {}
