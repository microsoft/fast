import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
    accentForegroundActiveBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundHoverBehavior,
} from "@microsoft/fast-components";

export const SideNavigationStyles = css`
    ${display("flex")}:host {
        --engaged-height: calc(var(--design-unit) * 13px);
        --design-unit-large: calc(var(--design-unit) * 5px);
        contain: content;
        font-family: var(--body-font);
        flex-direction: column;
        justify-content: center;
    }

    ul {
        list-style-type: none;
        padding: 0 var(--design-unit-large);
    }

    li {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .icon {
        fill: var(--accent-foreground-cut-rest);
    }

    li:hover .icon {
        fill: var(--accent-fill-hover);
    }

    .scroll-indicator {
        height: calc(var(--design-unit) * 9px);
        width: calc(var(--focus-outline-width) * 1px);
        background-color: ${accentForegroundCutRestBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        margin: calc(var(--design-unit) * 2px) var(--design-unit-large) 0;
        transition: 300ms ease-in-out;
        transition-property: background-color, height;
    }

    .scroll-indicator-active {
        height: var(--engaged-height);
        background-color: ${accentForegroundActiveBehavior.var};
    }
`.withBehaviors(
    accentForegroundActiveBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundHoverBehavior
);
