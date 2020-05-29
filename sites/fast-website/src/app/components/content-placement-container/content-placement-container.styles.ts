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
    ${display("block")}:host {
        --flow: column;
        --border-width: calc(var(--outline-width) * 1px);
        --border: var(--border-width) solid var(--neutral-outline-rest);
        contain: none;
        font-family: var(--body-font);
    }

    .framework_container,
    .community_container {
        display: grid;
        grid-template-columns: 1fr;
        justify-content: center;
    }

    .feature_container {
        display: grid;
        grid-template-rows: repeat(4, min-content);
        grid-auto-flow: var(--flow);
        justify-content: center;
    }

    .framework_ContentPlacement {
        border: var(--border);
        border-width: 0 0 var(--border-width);
        padding: 0 calc(var(--design-unit) * 2px);
    }

    .framework_ContentPlacement:last-of-type {
        border-bottom: none;
    }

    @media screen and (min-width: 700px) {
        .framework_ContentPlacement {
            border-width: 0 var(--border-width) var(--border-width) 0;
        }
    }

    @media screen and (max-width: 900px) {
        :host {
            --flow: row;
        }
    }

    @media screen and (min-width: 700px) and (max-width: 999px) {
        .framework_container {
            grid-template-columns: repeat(2, 1fr);
        }

        .community_container {
            grid-template-columns: repeat(3, 1fr);
        }

        .framework_ContentPlacement:nth-of-type(even) {
            border-right: none;
        }

        .framework_ContentPlacement:nth-last-of-type(-n + 2):nth-of-type(odd) {
            /* The last two items on medium screens have no bottom border */
            border-bottom: none;
        }
    }

    @media screen and (min-width: 1000px) {
        .framework_container,
        .community_container {
            grid-template-columns: repeat(3, 1fr);
        }

        .framework_ContentPlacement:nth-of-type(3n),
        .framework_ContentPlacement:first-of-type
            + .framework_ContentPlacement:last-of-type,
        .framework_ContentPlacement:only-of-type {
            border-right: none;
        }

        .framework_ContentPlacement:first-of-type:nth-last-of-type(3n):nth-last-of-type(-n + 3), /* first item when only three items are present */
        .framework_ContentPlacement:first-of-type:nth-last-of-type(3n) ~ .framework_ContentPlacement:nth-last-of-type(-n + 3), /* last three items when full row of three */
        .framework_ContentPlacement:first-of-type:nth-last-of-type(3n - 1) ~ .framework_ContentPlacement:nth-last-of-type(-n + 2), /* more than one row, last row with only two items */
        .framework_ContentPlacement:first-of-type:nth-last-of-type(3n - 2) ~ .framework_ContentPlacement:last-of-type, /* more than one row, last row with only one item */
        .framework_ContentPlacement:first-of-type:nth-last-of-type(-n + 2) {
            /* only two items on a row that should fit three */
            border-bottom: none;
        }

        .framework_ContentPlacement:nth-of-type(6) {
            border: none;
        }
    }

    /* This creates the color, background, and elevation changes on hover */
    /* start */
    .community_container:hover site-content-placement,
    .feature_container:hover site-feature-card {
        color: var(--neutral-foreground-hint);
    }
    .community_container:hover site-content-placement:hover,
    .feature_container:hover site-feature-card:hover {
        --elevation: 4;
        background: var(--neutral-fill-active);
        border-radius: calc(var(--corner-radius) * 1px);
        color: var(--neutral-foreground-hover);
        ${elevation}
    }
    /* end */

    .icon {
        fill: currentColor;
    }

    h3 {
        margin: 0 0 calc(var(--design-unit) * 5px) 0;
        font-size: var(--type-ramp-plus-2-font-size);
    }
`.withBehaviors(
    neutralForegroundHintBehavior,
    neutralForegroundHoverBehavior,
    neutralOutlineRestBehavior,
    neutralFillActiveBehavior
);
