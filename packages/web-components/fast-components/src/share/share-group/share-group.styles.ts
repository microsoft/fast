import { css } from "@microsoft/fast-element";
import {
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { heightNumber, neutralForegroundHintBehavior } from "../../styles/index";

export const ShareGroupStyles = css`
    ${display("block")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        padding: calc(var(--design-unit) * 5px) calc(var(--design-unit) * 4px);
        color: ${neutralForegroundHintBehavior.var};
        fill: ${neutralForegroundHintBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid transparent;
    }

    .links-container {
        display: flex;
        flex-wrap: wrap;
    }
`;
