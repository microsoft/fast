import { css } from "@microsoft/fast-element";

export const DisclosureStyles = css`
    :host {
        display: block;
    }

    :host ::slotted([slot="invoker"]) {
        margin: 1rem auto;
    }

    :host([no-margin]) ::slotted([slot="invoker"]) {
        margin: 0;
    }

    :host ::slotted([slot="content"]) {
        overflow: hidden;
    }
`;
