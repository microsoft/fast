import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    neutralForegroundRestBehavior,
} from "@microsoft/fast-components";

export const SideNavigationStyles = css`
    ${display("flex")}:host {
        --engaged-height: calc(var(--design-unit) * 9px);
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

    li {
        height: calc(var(--design-unit) * 12px);
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    li:hover .icon {
        fill: var(--accent-fill-hover);
    }

    .scroll-indicator {
        height: var(--design-unit-large);
        width: calc(var(--design-unit) * 1px);
        background-color: ${neutralForegroundRestBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        margin: 0 var(--design-unit-large);
    }

    a:hover .scroll-indicator {
        height: var(--engaged-height);
        background-color: ${accentForegroundHoverBehavior.var};
    }

    .scroll-indicator-active {
        height: var(--engaged-height);
        background-color: ${accentForegroundActiveBehavior.var};
    }
`.withBehaviors(
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    neutralForegroundRestBehavior
);
