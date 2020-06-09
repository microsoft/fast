import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { elevation } from "@microsoft/fast-components/dist/esm/styles/elevation.js";
import {
    neutralForegroundHintBehavior,
    neutralForegroundHoverBehavior,
    neutralOutlineRestBehavior,
    neutralFillActiveBehavior,
    accentForegroundRestBehavior,
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

    :host([section="feature"]) {
        --flow: column;
        grid-template-rows: repeat(4, min-content);
        grid-auto-flow: var(--flow);
        justify-content: center;
    }

    :host([section="community"]) {
        grid-template-columns: repeat(auto-fit, minmax(225px, 1fr));
    }

    /* this creates the numbering for feature*/
    :host([section="feature"]) {
        counter-reset: feature-counter;
    }

    :host([section="feature"]) site-feature-card {
        counter-increment: feature-counter;
    }

    :host([section="feature"]) site-feature-card :first-child::before {
        display: block;
        content: counter(feature-counter, decimal-leading-zero);
        font-size: var(--type-ramp-base-font-size);
        margin-bottom: calc(var(--design-unit) * 2px);
    }

    :host([section="feature"]) site-feature-card:hover :first-child::before {
        color: var(--accent-foreground-rest);
    }

    /* end */

    /* This creates the color, background, and elevation changes on hover */

    :host([section="feature"]:hover) site-card-section,
    :host([section="community"]:hover) site-content-placement,
    :host([section="community"]:hover) site-content-placement ::part(content) {
        color: var(--neutral-foreground-hint);
    }

    :host([section="feature"]) site-feature-card:hover {
        color: var(--neutral-foreground-rest);
        background: var(--neutral-fill-focus);
        cursor: pointer;
    }

    :host([section="community"]) site-content-placement:hover {
        --elevation: 4;
        cursor: pointer;
        background: var(--neutral-fill-focus);
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

    site-feature-card:not(:nth-of-type(4n)):hover + site-feature-card::before {
        opacity: 0;
    }

    @media screen and (max-width: 1330px) {
        :host([section="feature"]) {
            --flow: row;
        }
        site-feature-card:hover + site-feature-card::before {
            opacity: 0;
        }
    }

    @media screen and (max-width: 750px) {
        :host([section="community"]) {
            grid-template-columns: unset;
        }
    }

    @media screen and (max-width: 900px) {
        :host([section="feature"]) site-feature-card :first-child {
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-between;
        }
        :host([section="feature"]) site-feature-card :first-child::before {
            color: var(--accent-foreground-rest);
        }
    }
`.withBehaviors(
    accentForegroundRestBehavior,
    neutralForegroundHintBehavior,
    neutralForegroundHoverBehavior,
    neutralOutlineRestBehavior,
    neutralFillActiveBehavior
);
