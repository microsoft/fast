import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const ContentPlacementStyles = css`
    ${display("block")} :host {
        contain: content;
        font-family: var(--body-font);
        box-sizing: border-box;
    }

    fast-card {
        background: transparent;
        padding: calc(var(--design-unit) * 5px);
        text-align: left;
        display: flex;
        flex-direction: column;
    }

    fast-card ::slotted([slot="body"]) {
        flex: 1 1 auto;
        margin: 0;
        font-size: var(--type-ramp-base-font-size);
    }

    fast-card ::slotted([slot="action"]) {
        margin-top: calc(var(--design-unit) * 2px);
    }

    fast-card:hover .contentPlacement_icon {
        visibility: visible;
    }

    fast-card .contentPlacement_icon {
        visibility: hidden;
        margin-bottom: calc(var(--design-unit) * 5px);
    }
`;
