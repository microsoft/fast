import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    neutralForegroundRestBehavior,
} from "@microsoft/fast-components";

export const SideNavigationStyles = css`
    ${display("block")}:host {
        --engaged-height: calc(var(--design-unit) * 10px);
        --design-unit-large: calc(var(--design-unit) * 5px);
        contain: content;
        font-family: var(--body-font);
        flex-direction: column;
    }

    ul {
        list-style-type: none;
        padding: 0 var(--design-unit-large);
    }

    li:hover .icon {
        fill: var(--accent-fill-hover);
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

    .scroll-indicator-active {
        height: var(--engaged-height);
        background-color: var(--accent-foreground-active);
    }
`.withBehaviors(
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    neutralForegroundRestBehavior
);
