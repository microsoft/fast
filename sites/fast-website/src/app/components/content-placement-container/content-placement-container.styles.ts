import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { elevation } from "@microsoft/fast-components/dist/esm/styles/elevation.js";
import {
    accentForegroundRestBehavior,
    neutralFillFocusBehavior,
    neutralForegroundRestBehavior,
} from "@microsoft/fast-components";

export const ContentPlacementContainerStyles = css`
    ${display("grid")}:host {
        justify-content: center;
        position: relative;
    }

    fast-anchor {
        color: currentColor;
    }

    :host * {
        transition: all 0.3s ease-out;
    }

    :host([section="framework"]) {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        contain: content;
        overflow: hidden;
    }

    :host([section="feature"]) {
        --flow: column;
        grid-template-rows: repeat(3, min-content);
        grid-template-columns: repeat(2, 1fr);
        grid-auto-flow: var(--flow);
        justify-content: center;
        counter-reset: feature-counter;
    }

    /* this creates the numbering for feature*/

    :host([section="feature"]) site-feature-card {
        counter-increment: feature-counter;
    }

    :host([section="feature"]) site-feature-card :first-child::before {
        display: block;
        content: counter(feature-counter, decimal-leading-zero);
        font-size: var(--type-ramp-base-font-size);
        margin-bottom: calc(var(--design-unit) * 2px);
    }

    /* end */

    /* This creates the color, background, and elevation changes on hover */

    :host(:hover) site-feature-card,
    :host(:focus-within) site-feature-card,
    :host(:hover) site-content-placement,
    :host(:focus-within) site-content-placement {
        opacity: 0.6;
    }

    :host site-feature-card:hover,
    :host site-feature-card:focus-within,
    :host site-content-placement:hover,
    :host site-content-placement:focus-within {
        --elevation: 16;
        background: ${neutralFillFocusBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        color: currentColor;
        opacity: 1;
        ${elevation}
    }

    :host([section="framework"]) site-content-placement:hover h3,
    :host([section="framework"]) site-content-placement:focus-within h3,
    :host([section="feature"]) site-feature-card:hover :first-child::before,
    :host([section="feature"]) site-feature-card:focus-within :first-child::before,
    :host([section="feature"]) site-feature-card:hover fast-anchor,
    :host([section="feature"]) site-feature-card:focus-within fast-anchor,
    :host([section="community"]) site-content-placement:hover ::part(content),
    :host([section="community"]) site-content-placement:focus-within ::part(content) {
        color: ${accentForegroundRestBehavior.var};
    }

    :host([section="framework"]) site-content-placement:hover h3 .headerSubscript,
    :host([section="framework"]) site-content-placement:focus-within h3 .headerSubscript {
        color: ${neutralForegroundRestBehavior.var};
    }

    fast-anchor::part(content)::before {
        background: ${neutralForegroundRestBehavior.var};
    }

    site-feature-card:hover fast-anchor::part(content)::before,
    site-feature-card:focus-within fast-anchor::part(content)::before,
    site-content-placement:hover fast-anchor::part(content)::before,
    site-content-placement:focus-within fast-anchor::part(content)::before {
        background: ${accentForegroundRestBehavior.var};
    }

    /* end */

    .headerSubscript {
        font-size: var(--type-ramp-minus-1-font-size);
    }

    .icon {
        fill: currentColor;
        width: 16px;
        height: 16px;
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
            grid-template-columns: unset;
        }
        site-feature-card:hover + site-feature-card::before {
            opacity: 0;
        }
    }

    @media screen and (min-width: 750px) {
        :host([section="community"]) {
            grid-template-columns: repeat(auto-fit, minmax(225px, 1fr));
        }
    }

    @media screen and (max-width: 900px) {
        :host([section="feature"]) site-feature-card :first-child {
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-between;
        }
        :host([section="feature"]) site-feature-card :first-child::before {
            color: ${accentForegroundRestBehavior.var};
        }
    }
`.withBehaviors(
    accentForegroundRestBehavior,
    neutralFillFocusBehavior,
    neutralForegroundRestBehavior
);
