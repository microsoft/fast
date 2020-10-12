import { css } from "@microsoft/fast-element";
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    accentForegroundRestBehavior,
    neutralFillActiveBehavior,
    neutralFillHoverBehavior,
    neutralFillRestBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralForegroundActiveBehavior,
    neutralForegroundHintBehavior,
    neutralForegroundHoverBehavior,
    neutralForegroundRestBehavior,
} from "../styles/recipes";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { heightNumber } from "../styles/size";

export const DataGridHeaderCellStyles = css`
    :host {
        height: calc(${heightNumber} * 1px);
        padding: calc(var(--design-unit) * 5px) calc(var(--design-unit) * 4px);
        color: ${neutralForegroundRestBehavior.var};
        background: ${neutralFillStealthRestBehavior.var};
        box-sizing: border-box,
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-line-height);
        line-height: var(--type-ramp-base-line-height);
    }

`.withBehaviors(
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    accentForegroundRestBehavior,
    neutralFillActiveBehavior,
    neutralFillHoverBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundHintBehavior,
    neutralForegroundActiveBehavior,
    neutralForegroundHoverBehavior,
    neutralForegroundRestBehavior,
    forcedColorsStylesheetBehavior(
        css`
            :host {
            }
        `
    )
);
