import { css } from "@microsoft/fast-element";
import { display, forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import { elevation } from "../styles";
import { neutralLayerCardBehavior } from "../styles/index";
import { SystemColors } from "@microsoft/fast-web-utilities";
export const CardStyles = css`
    ${display("block")} :host {
        --elevation: 4;
        display: block;
        contain: content;
        height: var(--card-height, 100%);
        width: var(--card-width, 100%);
        box-sizing: border-box;
        background: ${neutralLayerCardBehavior.var};
        border-radius: calc(var(--elevated-corner-radius) * 1px);
        ${elevation};
    }
`.withBehaviors(neutralLayerCardBehavior);
