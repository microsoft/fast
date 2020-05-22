import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundRestBehavior,
    neutralForegroundHintBehavior,
    neutralForegroundRestBehavior,
} from "@microsoft/fast-components";

export const FastFrameStyles = css`
    ${display("block")} :host {
        flex-direction: column;
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        box-sizing: border-box;
        text-align: center;
    }

    .icon {
        pointer-events: none;
    }

    .wrapper {
        display: grid;
        grid-template-columns: 500px 1fr;
        min-height: 500px;
    }

    .content {
        display: flex;
        flex-direction: column;
        width: 100%;
        text-align: start;
        background: var(--background-color);
        padding: 40px;
    }

    .content-control-container {
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: 1fr auto;
        grid-gap: 20px;
        align-items: center;
    }

    .content-control-container-2 {
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;
    }

    .content-control-container :not(label) {
        justify-self: end;
    }

    .content h1 {
        font-size: var(--type-ramp-minus-1-font-size);
        line-height: var(--type-ramp-base-line-height);
        color: var(--neutral-foreground-hint);
        margin: 0;
        margin-bottom: 15px;
        font-weight: bold;
        text-transform: uppercase;
    }

    .content-heading-highlight {
        color: var(--accent-foreground-rest);
    }

    .content h2 {
        font-size: var(--type-ramp-plus-3-font-size);
        line-height: var(--type-ramp-plus-3-line-height);
        margin: 0;
        margin-bottom: 10px;
        font-weight: bold;
    }

    .preview {
        display: grid;
        grid-gap: 40px;
        grid-template-columns: 280px 1fr;
        padding: 40px;
        background: var(--background-color);
    }

    .image-container {
        /** Temp background */
        background: #c8c8c8;
        width: 100%;
        height: 215px;
        display: flex;
    }

    .text-container {
        display: flex;
        flex-direction: column;
        padding: 20px;
        text-align: start;
        color: var(--neutral-foreground-rest);
    }

    .badge {
        align-self: flex-end;
        margin: 20px;
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
        grid-template-columns: auto auto 1fr;
        grid-gap: 20px;
    }

    .control-container p {
        margin-inline-start: calc(var(--design-unit) * 2px + 2px);
    }

    .control-container-column {
        display: grid;
    }

    .control-container-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        text-align: start;
        color: var(--neutral-foreground-rest);
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
        margin-inline-start: calc(var(--design-unit) * 2px + 2px);
    }

    .sample-control-icon {
        width: 21px;
        height: 21px;
        background-color: var(--accent-fill-rest);
        border-radius: calc(var(--corner-radius) * 1px);
    }

    .saturation-slider-track {
        height: calc(var(--track-size) * 1px);
        border-radius: calc(var(--corner-radius) * 1px);
    }

    .hue-slider-track {
        height: calc(var(--track-size) * 1px);
        border-radius: calc(var(--corner-radius) * 1px);
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

    fast-card {
        width: auto;
    }

    fast-badge {
        --badge-fill-primary: var(--accent-fill-rest);
        --badge-color-primary: var(--neutral-foreground-rest);
    }

    fast-slider {
        min-width: unset;
    }

    fast-tab-panel {
        background: var(--background-color);
        height: auto;
    }

    fast-radio-group::part(positioning-region) {
        display: grid;
        grid-gap: 10px;
        grid-auto-flow: column;
    }

    site-color-swatch {
        margin: 0;      
    }

    fast-slider-label {
        font-size: var(--type-ramp-minus-2-font-size);
        color: var(--neutral-foreground-hint);
    }
`.withBehaviors(
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundRestBehavior,
    neutralForegroundHintBehavior,
    neutralForegroundRestBehavior
);
