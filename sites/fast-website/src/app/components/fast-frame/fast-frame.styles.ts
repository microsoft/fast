import { css } from "@microsoft/fast-element";
import { display, forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import {
    bodyFont,
    neutralForegroundRest,
    fillColor,
    controlCornerRadius,
    neutralFillLayerRest,
    typeRampMinus1FontSize,
    typeRampMinus1LineHeight,
    neutralForegroundHint,
    typeRampPlus3FontSize,
    typeRampPlus3LineHeight,
    designUnit,
    accentFillRest,
    typeRampMinus2FontSize,
} from "@microsoft/fast-components";
import { drawerBreakpoint } from "./fast-frame";
import { SystemColors } from "@microsoft/fast-web-utilities";

export const FastFrameStyles = css`
    ${display("block")} :host {
        flex-direction: column;
        font-family: ${bodyFont};
        color: ${neutralForegroundRest};
        box-sizing: border-box;
        text-align: center;
        width: 100%;
        background: ${fillColor};
        border-radius: calc(${controlCornerRadius} * 1px);
    }

    :host {
        --gutter: 20;
        max-width: 100vw;
    }

    .icon {
        pointer-events: none;
    }

    .wrapper {
        display: grid;
        grid-template-columns: minMax(400px, 500px) 1fr;
        min-height: 500px;
        width: 100%;
        position: relative;
    }

    .content {
        display: flex;
        flex-direction: column;
        width: 100%;
        text-align: start;
        background: ${neutralFillLayerRest};
        padding: calc(var(--gutter) * 2px);
    }

    .content-control-container {
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: 1fr auto;
        grid-gap: calc(var(--gutter) * 1px);
        align-items: center;
    }

    .content-control-container-2 {
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: 1fr 1fr;
        grid-gap: calc(var(--gutter) * 1px);
    }

    .content-control-container :not(label) {
        justify-self: end;
    }

    .content .content-badge {
        --design-unit: 0;
        font-size: ${typeRampMinus1FontSize};
        line-height: ${typeRampMinus1LineHeight};
        color: ${neutralForegroundHint};
        margin: 0;
        margin-bottom: 15px;
        font-weight: bold;
        text-transform: uppercase;
    }

    .content .content-badge .content-badge-highlight {
        color: ${neutralForegroundHint};
    }

    .content .heading {
        font-size: ${typeRampPlus3FontSize};
        line-height: ${typeRampPlus3LineHeight};
        margin: 0;
        margin-bottom: 10px;
        font-weight: bold;
    }

    .preview {
        display: grid;
        grid-gap: calc(var(--gutter) * 2px);
        grid-template-columns: auto 300px;
        padding: calc(var(--gutter) * 2px);
        position: relative;
        border-radius: 0 calc(${controlCornerRadius} * 1px) calc(${controlCornerRadius} * 1px) 0;
        background: ${fillColor};
    }

    .image-container {
        /** Temp background */
        background: #D6D6D6;
        width: 100%;
        height: 215px;
        display: flex;
    }

    .text-container {
        display: flex;
        flex-direction: column;
        padding: calc(var(--gutter) * 1px);
        text-align: start;
        color: ${neutralForegroundRest};
    }

    .badge {
        align-self: flex-end;
        margin: calc(var(--gutter) * 1px);
    }

    .preview-controls {
        display: grid;
        grid-auto-rows: max-content;
        grid-gap: 20px;
    }

    .control-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;
    }

    .control-container-2 {
        display: grid;
        grid-template-columns: 1fr auto auto;
        grid-gap: 20px;
    }

    .control-container p {
        margin-inline-start: calc(${designUnit} * 2px + 2px);
    }

    .control-container-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        text-align: start;
        color: ${neutralForegroundRest};
    }

    .checkbox {
        grid-row: 2;
    }

    .checkbox-label {
        grid-row: 2;
        grid-column: 2;
    }

    .icon {
        fill: currentColor;
    }

    .sample-control {
        display: flex;
        align-items: center;
        width: 100%;
    }

    .sample-control-actions {
        margin-inline-start: auto;
    }

    .sample-control-text {
        margin-inline-start: calc(${designUnit} * 2px + 2px);
    }

    .sample-control-icon {
        width: 21px;
        height: 21px;
        background-color: ${accentFillRest};
        border-radius: calc(${controlCornerRadius} * 1px);
    }

    .saturation-slider-track {
        height: 100%;
        border-radius: calc(${controlCornerRadius} * 1px);
    }

    .hue-slider-track {
        height: 100%;
        border-radius: calc(${controlCornerRadius} * 1px);
        background-image:
            linear-gradient(
                to right,
                rgb(255, 0, 0),
                rgb(255, 77, 0),
                rgb(255, 153, 0),
                rgb(255, 230, 0),
                rgb(204, 255, 0),
                rgb(128, 255, 0),
                rgb(51, 255, 0),
                rgb(0, 255, 26),
                rgb(0, 255, 102),
                rgb(0, 255, 179),
                rgb(0, 255, 255),
                rgb(0, 179, 255),
                rgb(0, 102, 255),
                rgb(0, 26, 255),
                rgb(51, 0, 255),
                rgb(128, 0, 255),
                rgb(204, 0, 255),
                rgb(255, 0, 230),
                rgb(255, 0, 153),
                rgb(255, 0, 76),
                rgb(255, 0, 4)
            );"
    }

    .responsive-expand-flipper {
        position: absolute;
        left: -30px;
        align-self: center;
        display: none;
        visibility: hidden;
    }

    fast-card {
        width: 280px;
    }

    fast-badge {
        --badge-fill-primary: #E4BC11;
        --badge-color-primary: #000000;
    }

    fast-slider {
        min-width: unset;
    }

    fast-tab-panel {
        background: ${neutralFillLayerRest};
        height: 100%;
    }

    fast-tab[aria-selected="true"] {
        background: transparent;
    }

    fast-radio-group.example-radios {
        margin: 0;
    }

    fast-radio-group.example-radios::part(positioning-region) {
        display: grid;
        grid-template-columns: auto;
        height: 100%;
    }

    fast-radio-group.swatches::part(positioning-region) {
        display: grid;
        grid-gap: 10px;
        grid-auto-flow: column;
    }

    site-color-swatch {
        margin: 0;
    }

    fast-slider-label {
        font-size: ${typeRampMinus2FontSize};
        color: ${neutralForegroundHint};
    }

    @media screen and (max-width: 1330px) {
        :host {
            --gutter: 10;
        }

        fast-card {
            display: none;
        }

        .preview {
            grid-template-columns: minMax(300px, auto);
            border-radius: calc(${controlCornerRadius} * 1px);
        }

    }
    @media screen and (max-width: ${drawerBreakpoint}) {
        :host {
            --gutter: 10;
        }

        fast-card {
            display: none;
        }

        .preview {
            position: absolute;
            right: -90%;
            grid-template-columns: 100%;
            width: 80%;
            transition: right .5s ease-in-out;
            align-self: center;
            border-radius: calc(${controlCornerRadius} * 1px);
        }

        .preview-expanded {
            transition: right .5s ease-in-out;
            right: -10%;
        }

        .wrapper {
            display: grid;
            grid-template-columns: auto;
            width: calc(100vw - 20vw);
        }

        .responsive-expand-flipper {
            display: inline-flex;
            visibility: visible;
        }

        .tab-panel-expanded {
            opacity: 0;
            transition: opacity .5s ease-in-out;
        }

        fast-tab-panel {
            opacity: 1;
            transition: opacity .5s ease-in-out;
        }

    }
    @media screen and (max-width: 480px) {
        .preview {
            right: -88%;
            width: 70%;
            border-radius: calc(${controlCornerRadius} * 1px);
        }

        .preview-expanded {
            right: -5%;
        }

        .wrapper {
            width: calc(100vw - 12vw);
        }

        .content-control-container {
            grid-template-columns: 1fr;
        }

        .content-control-container-2 {
            grid-template-columns: 1fr;
        }

        .content-control-container :not(label) {
            justify-self: start;
        }

        fast-tabs::part(tablist) {
            padding: 16px 4px 16px 0;
        }
    }
`.withBehaviors(
    forcedColorsStylesheetBehavior(
        css`
            .text-container {
                color: ${SystemColors.ButtonText};
            }
            fast-tab:hover[aria-selected="true"] {
                background: ${SystemColors.Highlight};
                fill: ${SystemColors.HighlightText};
            }
        `
    )
);
