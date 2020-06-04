import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { elevation } from "@microsoft/fast-components/dist/esm/styles/elevation.js";
import {
    neutralForegroundHintBehavior,
    neutralForegroundHoverBehavior,
    neutralOutlineRestBehavior,
    neutralFillActiveBehavior,
} from "@microsoft/fast-components";

export const ContentPlacementContainerStyles = css`
    ${display("grid")}:host {
        justify-content: center;
        position: relative;
    }

    :host([section="framework"]) {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        contain: content;
        overflow: hidden;
    }

    :host([section="community"]) {
        grid-template-columns: repeat(auto-fit, minmax(225px, 1fr));
    }

    /* This creates the color, background, and elevation changes on hover */

    :host([section="feature"]:hover) site-card-section,
    :host([section="community"]:hover) site-content-placement,
    :host([section="community"]:hover) site-content-placement ::part(content) {
        color: var(--neutral-foreground-hint);
    }

    :host([section="feature"]) site-feature-card:hover {
        color: var(--neutral-foreground-rest);
    }

    :host([section="community"]) site-content-placement:hover {
        --elevation: 4;
        cursor: pointer;
        background: var(--neutral-fill-active);
        border-radius: calc(var(--corner-radius) * 1px);
        color: currentColor;
        ${elevation}
    }

    :host([section="community"]) site-content-placement:hover ::part(content) {
        color: var(--accent-foreground-rest);
    }

    /* end */

    .headerSubscript {
        color: var(--neutral-foreground-hint);
        font-size: var(--type-ramp-minus-1-font-size);
    }

    .icon {
        fill: currentColor;
    }

    h3 {
        margin: 0 0 calc(var(--design-unit) * 5px) 0;
        font-size: var(--type-ramp-plus-2-font-size);
    }

    @media screen and (max-width: 750px) {
        :host([section="community"]) {
            grid-template-columns: unset;
        }
    }
`.withBehaviors(
    neutralForegroundHintBehavior,
    neutralForegroundHoverBehavior,
    neutralOutlineRestBehavior,
    neutralFillActiveBehavior
);
