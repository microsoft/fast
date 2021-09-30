import { customElement, FASTElement, html } from "@microsoft/fast-element";

@customElement({
    name: "fast-slot",
    template: html`
        <slot></slot>
    `,
})
export class Slot extends FASTElement {}
