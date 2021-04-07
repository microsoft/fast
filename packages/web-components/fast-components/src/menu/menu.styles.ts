import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import { display, forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    neutralDividerRestBehavior,
    neutralLayerFloatingBehavior,
} from "../styles/recipes";
import { elevation } from "../styles/elevation";

/**
 * Styles for the {@link FASTMenu|FASTMenu component}.
 *
 * @public
 */
export const MenuStyles: ElementStyles = css`
    ${display("block")} :host {
        --elevation: 11;
        background: ${neutralLayerFloatingBehavior.var};
        border: calc(var(--outline-width) * 1px) solid transparent;
        ${elevation}
        margin: 0;
        border-radius: calc(var(--corner-radius) * 1px);
        padding: calc(var(--design-unit) * 1px) 0;
        max-width: 368px;
        min-width: 64px;
    }

    :host([slot="submenu"]) {
        width: max-content;
        margin: 0 calc(var(--design-unit) * 1px);
    }

    ::slotted(hr) {
        box-sizing: content-box;
        height: 0;
        margin: 0;
        border: none;
        border-top: calc(var(--outline-width) * 1px) solid var(--neutral-divider-rest);
    }
`.withBehaviors(
    neutralLayerFloatingBehavior,
    neutralDividerRestBehavior,
    forcedColorsStylesheetBehavior(
        css`
            :host {
                background: ${SystemColors.Canvas};
                border-color: ${SystemColors.CanvasText};
            }
        `
    )
);
