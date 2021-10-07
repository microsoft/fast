import { FASTElement, html } from "@microsoft/fast-element";

export class Slot extends FASTElement {}

FASTElement.define(Slot, {
    name: "fast-slot",
    template: html`
        <slot></slot>
    `,
});
