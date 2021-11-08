import { css } from "@microsoft/fast-element";
import { accentForegroundRest } from "..";
import {
    accentFillRest,
    bodyFont,
    designUnit,
    neutralFillRest,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";

export const gaugeStyles = css`
    :host {
        --gauge-size: 360;
        font-family: ${bodyFont};
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        color: ${neutralForegroundRest};
        position: relative;
        width: 100px;
        height: 100px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition-duration: 1s;
        transition-delay: 0;
        fill: none;
        stroke: ${accentFillRest};
    }

    svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        stroke: inherit;
        transition-duration: inherit;
        transition-delay: inherit;
        transform: rotate(calc(((360 - var(--gauge-size)) * 0.5deg) + 90deg));
        fill: none;
    }

    .meter,
    .value {
        r: calc(50% - 2px);
        stroke: ${neutralFillRest};
        stroke-width: calc(${designUnit} * 1px);
        stroke-dasharray: var(--gauge-size) calc(360 - var(--gauge-size));
        z-index: 2;
        transform-origin: center center;
    }

    .value {
        stroke: inherit;
        stroke-dasharray: 0 360;
        transition-duration: inherit;
        transition-delay: inherit;
        transition-property: stroke-dasharray;
        transition-timing-function: ease-out;
        z-index: 3;
    }

    .face {
        position: absolute;
        display: block;
        width: 100%;
        height: 100%;
        text-align: center;
        display: grid;
        border-radius: 50%;
        z-index: 1;
        transition-duration: inherit;
        transition-delay: inherit;
        transition-property: none;
    }

    .label {
        align-self: end;
    }
`;
