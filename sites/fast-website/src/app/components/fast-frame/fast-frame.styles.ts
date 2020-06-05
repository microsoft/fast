import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundRestBehavior,
    neutralForegroundHintBehavior,
    neutralForegroundRestBehavior,
    neutralFillCardRestBehavior,
} from "@microsoft/fast-components";
import { drawerBreakpoint } from "./fast-frame";

export const FastFrameStyles = css`
    ${display("block")} :host {
        flex-direction: column;
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        box-sizing: border-box;
        text-align: center;
        width: 100%;
        background: var(--background-color);
        border-radius: calc(var(--corner-radius) * 1px);
    }

    :host {
        --gutter: 20;
        max-width: 95vw;
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
        background: var(--neutral-fill-card-rest);
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
        grid-gap: calc(var(--gutter) * 2px);
        grid-template-columns: auto 300px;
        padding: calc(var(--gutter) * 2px);
        background: var(--neutral-fill-card-rest);
        position: relative;
        border-radius: 0 calc(var(--corner-radius) * 1px) calc(var(--corner-radius) * 1px) 0;
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
        padding: calc(var(--gutter) * 1px);
        text-align: start;
        color: var(--neutral-foreground-rest);
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
        --badge-fill-primary: var(--accent-fill-rest);
        --badge-color-primary: var(--neutral-foreground-rest);
    }

    fast-slider {
        min-width: unset;
    }

    fast-tab-panel {
        background: var(--neutral-fill-card-rest);
        height: 100%;
    }

    fast-tab[aria-selected="true"] {
        background: transparent;
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
    
    @media screen and (max-width: 1330px) {
        :host {
            --gutter: 10;
        }
    
        fast-card {
            display: none;
        }

        .preview {
            grid-template-columns: minMax(300px, auto);
            border-radius: calc(var(--corner-radius) * 1px);
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
            border-radius: calc(var(--corner-radius) * 1px);
        }

        .preview__expanded {
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
        
        .tab-panel__expanded {
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
            border-radius: calc(var(--corner-radius) * 1px);
        }

        .preview__expanded {
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
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundRestBehavior,
    neutralForegroundHintBehavior,
    neutralForegroundRestBehavior,
    neutralFillCardRestBehavior
);
