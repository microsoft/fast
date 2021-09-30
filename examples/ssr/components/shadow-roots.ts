import { customElement, FASTElement, html } from "@microsoft/fast-element";

@customElement({
    name: "fast-closed-shadow-root",
    template: html`
        <p>Closed shadow root</p>
    `,
    shadowOptions: {
        mode: "closed",
    },
})
export class ClosedShadowRoot extends FASTElement {}

@customElement({
    name: "fast-open-shadow-root",
    template: html`
        <p>Closed shadow root</p>
    `,
})
export class OpenShadowRoot extends FASTElement {}
