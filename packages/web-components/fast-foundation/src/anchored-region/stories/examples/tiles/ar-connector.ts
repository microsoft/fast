import {
    css,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
} from "@microsoft/fast-element";

export function registerARConnector() {
    ARConnector.define({
        name: "ar-connector",
        template: arConnectorTemplate(),
        styles: arConnectorStyles,
    });
}

/**
 *
 *
 * @public
 */
export class ARConnector extends FASTElement {
    @observable
    public anchorElement: HTMLElement | undefined;

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
    }
}

/**
 * The template
 * @public
 */
export function arConnectorTemplate<T extends ARConnector>(): ElementViewTemplate<T> {
    return html<T>`
        <template></template>
    `;
}

export const arConnectorStyles = css`
    :host {
        display: block;
    }
`;
