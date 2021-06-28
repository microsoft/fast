import { bodyFont, designUnit, typeRampBaseFontSize } from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

export const ContentPlacementStyles = css`
    ${display("grid")} :host {
        justify-content: center;
        contain: layout;
        font-family: ${bodyFont};
        box-sizing: border-box;
        position: relative;
    }

    fast-card {
        background: transparent;
        padding: calc(${designUnit} * 5px);
        text-align: left;
        display: flex;
        flex-direction: column;
        box-shadow: none;
    }

    fast-card ::slotted([slot="body"]) {
        flex: 1 1 auto;
        margin: 0;
        font-size: ${typeRampBaseFontSize};
    }

    fast-card ::slotted([slot="action"]) {
        margin-top: calc(${designUnit} * 2px);
        align-self: start;
    }

    fast-card:hover .contentPlacement_icon,
    fast-card:focus-within .contentPlacement_icon {
        opacity: 1;
    }

    fast-card .contentPlacement_icon {
        opacity: 0;
        margin-bottom: calc(${designUnit} * 5px);
    }
`;
