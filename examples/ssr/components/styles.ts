import { attr, css, FASTElement, html } from "@microsoft/fast-element";

const instanceStyles = css`
    :host {
        color: blue;
    }
`;
export class Styles extends FASTElement {
    connectedCallback(): void {
        super.connectedCallback();

        this.$fastController.addStyles(instanceStyles);
    }
}

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
