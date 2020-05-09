import { css } from "@microsoft/fast-element";
import { display, elevation, neutralLayerCardBehavior } from "@microsoft/fast-components";
// update the below imports once #3091 is merged
import { SystemColors } from "@microsoft/fast-components/dist/styles/system-colors";
import { forcedColorsStylesheetBehavior } from "@microsoft/fast-components/dist/styles/match-media-stylesheet-behavior";

export const CardStyles = css`
    ${display("block")} :host {
        --elevation: 4;
        display: block;
        contain: content;
        height: var(--card-height, 100%);
        width: var(--card-width, 100%);
        box-sizing: border-box;
        background: var(--neutral-layer-card);
        border-radius: calc(var(--elevated-corner-radius) * 1px);
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
