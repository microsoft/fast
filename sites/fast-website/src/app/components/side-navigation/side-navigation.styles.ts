import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
    accentForegroundActiveBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundHoverBehavior,
} from "@microsoft/fast-components";

export const SideNavigationStyles = css`
    ${display("flex")}:host {
        --design-unit-large: calc(var(--design-unit) * 5px);
        contain: content;
        font-family: var(--body-font);
        flex-direction: column;
        justify-content: center;
    }

    ul {
        list-style-type: none;
        padding: 0 var(--design-unit-large);
        cursor: pointer;
    }

    .icon {
        fill: var(--accent-foreground-cut-rest);
    }

    li:hover .icon {
        fill: var(--accent-fill-hover);
    }

    .scroll-indicator {
        height: calc(var(--design-unit) * 9px);
        width: calc(var(--design-unit) * 1px);
        background-color: var(--accent-foreground-cut-rest);
        border-radius: calc(var(--corner-radius) * 1px);
        margin: calc(var(--design-unit) * 3px) var(--design-unit-large);
        position: relative;
        transition: all 300ms;
    }

    .scroll-indicator::before,
    .scroll-indicator::after {
        content: "";
        height: 50%;
        width: 100%;
        border-radius: calc(var(--corner-radius) * 1px);
        transition: all 300ms;
        position: absolute;
    }

    .scroll-indicator::before {
        top: 0;
    }

    .scroll-indicator::after {
        bottom: 0;
    }

    .scroll-indicator-active {
        margin: var(--design-unit-large);
        background-color: var(--accent-foreground-active);
    }

    .scroll-indicator-active.scroll-indicator::before {
        transform: translateY(calc(var(--design-unit) * -2px));
        background-color: var(--accent-foreground-active);
    }

    .scroll-indicator-active.scroll-indicator::after {
        transform: translateY(calc(var(--design-unit) * 2px));
        background-color: var(--accent-foreground-active);
    }

    a:hover .scroll-indicator,
    a:hover .scroll-indicator-active.scroll-indicator::before,
    a:hover .scroll-indicator-active.scroll-indicator::after {
        background-color: var(--accent-foreground-hover);
    }
`.withBehaviors(
    accentForegroundActiveBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundHoverBehavior
);
