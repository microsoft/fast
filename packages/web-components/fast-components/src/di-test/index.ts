import { html, css } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";

export class DITest extends FoundationElement {}

export const DITestElementDefinition = FoundationElement.configuration({
    baseName: "di-test",
    type: DITest,
    template: html`
        <slot></slot>
    `,
    styles: css`
        :host {
            display: block;
        }
    `,
});
