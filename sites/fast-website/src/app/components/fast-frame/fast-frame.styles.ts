import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-components";
import {
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
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
        grid-template-columns: 1fr 1fr;
        height: 500px;
    }

    .content {
        display: flex;
        flex-direction: column;
        width: 100%;
        text-align: start;
    }

    .preview {
        display: grid;
        grid-gap: 40px;
        grid-template-columns: 1fr 1fr;
        padding: 40px;
        background: var(--background-color)
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
        display: flex;
        flex-flow: row wrap;
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

    .icon-cut {
        fill: var(--accent-foreground-cut-rest);
    }

    .icon {
        fill: var(--neutral-foreground-rest);
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

    fast-badge {
        --badge-fill-primary: var(--accent-fill-rest);
        --badge-color-primary: var(--neutral-foreground-rest);
    }

    fast-slider {
        min-width: unset;
    }

    fast-button {
        display: contents;
    }
`.withBehaviors(
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    neutralForegroundRestBehavior
);
