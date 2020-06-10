import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { elevation, neutralLayerCardBehavior } from "../styles/index";

export const CardStyles = css`
    ${display("block")} :host {
        --elevation: 4;
        display: block;
        contain: content;
        height: var(--card-height, 100%);
        width: var(--card-width, 100%);
        box-sizing: border-box;
        background: ${neutralLayerCardBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        ${elevation};
        border: calc(var(--outline-width) * 1px) solid transparent;
    }
`.withBehaviors(neutralLayerCardBehavior);
