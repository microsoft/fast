import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import { elevation } from "@microsoft/fast-components/dist/esm/styles/elevation.js";
import {
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    neutralForegroundRestBehavior,
} from "@microsoft/fast-components";

export const SideNavigationStyles = css`
    ${display("block")}:host {
        --engaged-height: calc(var(--design-unit) * 10px);
        --design-unit-large: calc(var(--design-unit) * 5px);
        --border: var(--border-width) solid var(--neutral-outline-rest);
        contain: content;
        font-family: var(--body-font);
        flex-direction: column;
    }

    ul {
        list-style-type: none;
        padding: 0 var(--design-unit-large);
    }

    .icon:hover {
        fill: var(--accent-fill-rest);
    }

    .scroll-indicator {
        height: var(--design-unit-large);
        width: calc(var(--design-unit) * 1px);
        background-color: var(--neutral-foreground-rest);
        border-radius: calc(var(--corner-radius) * 1px);
        margin: var(--design-unit-large);
    }

    a:hover .scroll-indicator {
        height: var(--engaged-height);
        background-color: var(--accent-foreground-hover);
    }

    .scroll-indicator-active-0 .scroll-indicator-0,
    .scroll-indicator-active-1 .scroll-indicator-1,
    .scroll-indicator-active-2 .scroll-indicator-2,
    .scroll-indicator-active-3 .scroll-indicator-3,
    .scroll-indicator-active-4 .scroll-indicator-4 {
        height: var(--engaged-height);
        background-color: var(--accent-foreground-active);
    }
`.withBehaviors(
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    neutralForegroundRestBehavior
);
