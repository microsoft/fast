import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-components";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import { accentFillRestBehavior, neutralForegroundRestBehavior } from "../styles";

export const TabsStyles = css`
    ${display("grid")} :host {
        box-sizing: border-box;
        font-family: var(--body-font);
        ${/* Font size, weight, and line height are temporary - 
            replace when adaptive typography is figured out */ ""} font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        color: var(--neutral-foreground-rest);
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
    }

    .start {
        padding: 2px;
    }

    .end {
        padding: 2px;
    }

    .activeIndicator {
        grid-row: 2;
        grid-column: 1;
        width: 20px;
        height: 3px;
        border-radius: calc(var(--corner-radius) * 1px);
        justify-self: center;
        background: var(--accent-fill-rest);
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

    :host(.vertical) {
        grid-template-rows: auto 1fr auto;
        grid-template-columns: auto 1fr;
    }

    :host(.vertical) .tablist {
        grid-row-start: 2;
        grid-row-end: 2;
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: auto 1fr;
        position: relative;
        width: max-content;
        justify-self: end;
        width: 100%;
    }

    :host(.vertical) .tabpanel {
        grid-column: 2;
        grid-row-start: 1;
        grid-row-end: 4;
    }

    :host(.vertical) .end {
        grid-row: 3;
    }

    :host(.vertical) .activeIndicator {
        grid-column: 1;
        grid-row: 1;
        width: 3px;
        height: 20px;
        border-radius: calc(var(--corner-radius) * 1px);
        align-self: center;
        background: var(--accent-fill-rest);
    }

    :host(.vertical) .activeIndicatorTransition {
        transition: transform 0.2s linear;
    }
`.withBehaviors(
    accentFillRestBehavior,
    neutralForegroundRestBehavior,
    forcedColorsStylesheetBehavior(
        css`
            .activeIndicator,
            :host(.vertical) .activeIndicator {
                forced-color-adjust: none;
                background: ${SystemColors.Highlight};
            }
        `
    )
);
