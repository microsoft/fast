import { customElement, FASTElement, html } from "@microsoft/fast-element";

export class ClosedShadowRoot extends FASTElement {}

FASTElement.define(ClosedShadowRoot, {
    name: "fast-closed-shadow-root",
    template: html`
        <p>Closed shadow root</p>
    `,
    shadowOptions: {
        mode: "closed",
    },
});

export class OpenShadowRoot extends FASTElement {}

FASTElement.define(OpenShadowRoot, {
    name: "fast-open-shadow-root",
    template: html`
        <p>Closed shadow root</p>
    `,
});
