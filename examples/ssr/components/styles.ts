import { css, FASTElement, html } from "@microsoft/fast-element";

export class Styles extends FASTElement {}

FASTElement.define(Styles, {
    name: "fast-styles",
    template: html`
        <p>Style node</p>
    `,
    styles: css`
        :host {
            color: red;
        }
    `,
});
