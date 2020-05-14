import { css } from "@microsoft/fast-element";
import { forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import { display, elevation } from "../styles";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { neutralLayerCardBehavior } from "../styles/recipes";

export const CardStyles = css`
    ${display("block")} :host {
        --elevation: 4;
        display: block;
        contain: content;
        height: var(--card-height, 100%);
        width: var(--card-width, 100%);
        box-sizing: border-box;
        background: var(--neutral-layer-card);
        border-radius: calc(var(--corner-radius) * 1px);
        ${elevation};
    }
`.withBehaviors(
    neutralLayerCardBehavior,
    forcedColorsStylesheetBehavior(
        css`
            :host {
                forced-color-adjust: none;
                border: calc(var(--outline-width) * 1px) solid ${SystemColors.CanvasText};
                background: ${SystemColors.Canvas};
            }
        `
    )
);
