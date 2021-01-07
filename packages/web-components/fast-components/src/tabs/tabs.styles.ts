import { css } from "@microsoft/fast-element";
import { display, forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillRestBehavior,
    heightNumber,
    neutralForegroundRestBehavior,
} from "../styles/index";

export const TabsStyles = css`
    ${display("grid")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        color: ${neutralForegroundRestBehavior.var};
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto 1fr;
    }

    .tablist {
        display: grid;
        grid-template-rows: auto auto;
        grid-template-columns: auto;
        position: relative;
        width: max-content;
        align-self: end;
        padding: calc(var(--design-unit) * 4px) calc(var(--design-unit) * 4px) 0;
        box-sizing: border-box;
    }

    .tablist-container {
        display: grid;
        grid-template-columns: auto auto auto;
        grid-template-rows: auto;
    }

    .start,
    .end {
        align-self: center;
    }

    .activeIndicator {
        grid-row: 2;
        grid-column: 1;
        width: 100%;
        height: 5px;
        justify-self: center;
        background: ${accentFillRestBehavior.var};
        margin-top: 10px;
        border-radius: calc(var(--corner-radius) * 1px) calc(var(--corner-radius) * 1px) 0
            0;
    }

    .activeIndicatorTransition {
        transition: transform 0.2s ease-in-out;
    }

    .tabpanel {
        grid-row: 2;
        grid-column-start: 1;
        grid-column-end: 4;
        position: relative;
    }

    :host([orientation="vertical"]) {
        grid-template-rows: auto 1fr auto;
        grid-template-columns: auto 1fr;
    }

    :host([orientation="vertical"]) .tablist {
        grid-row-start: 2;
        grid-row-end: 2;
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: auto 1fr;
        position: relative;
        width: max-content;
        justify-self: end;
        width: 100%;
        padding: calc((${heightNumber} - var(--design-unit)) * 1px)
            calc(var(--design-unit) * 4px)
            calc((${heightNumber} - var(--design-unit)) * 1px) 0;
    }

    :host([orientation="vertical"]) .tabpanel {
        grid-column: 2;
        grid-row-start: 1;
        grid-row-end: 4;
    }

    :host([orientation="vertical"]) .end {
        grid-row: 3;
    }

    :host([orientation="vertical"]) .activeIndicator {
        grid-column: 1;
        grid-row: 1;
        width: 5px;
        height: 100%;
        margin-inline-end: 10px;
        align-self: center;
        background: ${accentFillRestBehavior.var};
        margin-top: 0;
        border-radius: 0 calc(var(--corner-radius) * 1px) calc(var(--corner-radius) * 1px)
            0;
    }

    :host([orientation="vertical"]) .activeIndicatorTransition {
        transition: transform 0.2s linear;
    }
`.withBehaviors(
    accentFillRestBehavior,
    neutralForegroundRestBehavior,
    forcedColorsStylesheetBehavior(
        css`
            .activeIndicator,
            :host([orientation="vertical"]) .activeIndicator {
                forced-color-adjust: none;
                background: ${SystemColors.Highlight};
            }
        `
    )
);
