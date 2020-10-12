import { css } from "@microsoft/fast-element";
import { forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import {
    neutralDividerRestBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundActiveBehavior,
    neutralForegroundFocusBehavior,
    neutralForegroundHoverBehavior,
    neutralForegroundRestBehavior,
} from "../styles/recipes";

export const DataGridHeaderStyles = css`
    :host {
        display: grid;
        padding: 1px 0;
        box-sizing: border-box;
        width: 100%;
        border-bottom: calc(var(--outline-width) * 1px) solid var(--neutral-divider-rest);
        background: ${neutralFillRestBehavior.var};
    }
`.withBehaviors(
    neutralFillRestBehavior,
    forcedColorsStylesheetBehavior(
        css`
            :host {
            }
        `
    )
);
