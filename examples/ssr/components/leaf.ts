import { FASTElement, html } from "@microsoft/fast-element";

export class Leaf extends FASTElement {}

FASTElement.define(Leaf, {
    name: "fast-leaf",
    template: html`
        <p>Leaf node</p>
    `,
});
