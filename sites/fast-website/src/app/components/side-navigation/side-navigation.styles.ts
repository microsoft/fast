import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
    accentForegroundActiveBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundHoverBehavior,
} from "@microsoft/fast-components";

export const SideNavigationStyles = css`
    ${display("flex")} :host {
        --design-unit-large: calc(var(--design-unit) * 5px);
        contain: content;
        font-family: var(--body-font);
    }

    .item-list {
        list-style-type: none;
        margin: 0;
        padding: 0 var(--design-unit-large);
    }

    .list-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .icon {
        fill: var(--accent-foreground-cut-rest);
    }

    .list-item:hover .icon {
        fill: var(--accent-fill-hover);
    }

    .scroll-indicator {
        height: 36px;
        width: calc(var(--focus-outline-width) * 1px);
        background-color: ${accentForegroundCutRestBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        margin: calc(var(--design-unit) * 2px) var(--design-unit-large) 0;
        transition: 300ms ease-in-out;
        transition-property: background-color, height;
    }

    .scroll-indicator-active {
        height: 52px;
        background-color: ${accentForegroundActiveBehavior.var};
    }
`.withBehaviors(
    accentForegroundActiveBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundHoverBehavior
);
