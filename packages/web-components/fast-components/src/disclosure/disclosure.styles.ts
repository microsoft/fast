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

    :host ::slotted(*) {
        overflow: hidden;
        transition: max-height 0.35s, padding 0.35s, opacity 0.35s;
    }
`;
