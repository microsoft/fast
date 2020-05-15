import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const ContentPlacementStyles = css`
    ${display("block")} :host {
        contain: content;
        font-family: var(--body-font);
        box-sizing: border-box;
    }

    :host([hidden]) {
        display: none;
    }

    fast-card {
        background: transparent;
        padding: 0 calc(var(--design-unit) * 5px) calc(var(--design-unit) * 3px);
        text-align: left;
        display: flex;
        flex-direction: column;
    }

    fast-card ::slotted([slot="body"]) {
        flex: 1 1 auto;
    }

    fast-card:hover .contentPlacement_footer__hoverVisible {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .contentPlacement_footer__hoverVisible {
        visibility: hidden;
    }

    fast-card:hover .contentPlacement_footer__hoverVisible {
        visibility: visible;
    }

    fast-card:hover .contentPlacement_divider {
        visibility: visible;
    }

    fast-card:hover .contentPlacement_icon {
        visibility: visible;
    }

    .contentPlacement_divider {
        visibility: hidden;
    }

    fast-card .contentPlacement_icon {
        visibility: hidden;
        margin-top: calc(var(--design-unit) * 4px);
    }
`;
