import { css } from "@microsoft/fast-element";
import {
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { heightNumber, neutralForegroundHintBehavior } from "../../styles/index";

export const ShareLinkStyles = css`
    :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        padding: calc(var(--design-unit) * 1px) calc(var(--design-unit) * 1px);
        color: ${neutralForegroundHintBehavior.var};
        fill: ${neutralForegroundHintBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid transparent;
        height: 120px;
        width: 100px;
    }

    .icon-container {
        display: flex;
        justify-content: center;
        box-sizing: border-box;
        height: 70px;
        width: 70px;
        padding: 10px;
        border-radius: 50%;
        background-color: gray;
    }

    .title {
        margin: 0;
        text-align: center;
    }
`;
