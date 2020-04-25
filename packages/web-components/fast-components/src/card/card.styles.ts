import { css } from "@microsoft/fast-element";
import { display, elevation } from "../styles";
import { SystemColors } from "../styles/system-colors";
import { neutralLayerCardBehavior } from "../styles/recipes";
import { HighContrastStylesheetBehavior } from "../styles/high-contrast-stylesheet-behavior";

export const HighConstrastCardStyles = css`
    :host {
        forced-color-adjust: none;
        border: calc(var(--outline-width) * 1px) solid ${SystemColors.CanvasText};
        background: ${SystemColors.Canvas};
    }
`;

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
    new HighContrastStylesheetBehavior(HighConstrastCardStyles)
);
