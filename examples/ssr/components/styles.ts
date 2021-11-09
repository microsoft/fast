import { attr, css, FASTElement, html } from "@microsoft/fast-element";

const instanceStyles = css`
    :host {
        color: blue;
    }
`;
export class Styles extends FASTElement {
    @attr({ mode: "boolean", attribute: "instance-styles" })
    instanceStyles: boolean = false;
    instanceStylesChanged(): void {
        this.instanceStyles
            ? instanceStyles.addStylesTo(this)
            : instanceStyles.removeStylesFrom(this);
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
