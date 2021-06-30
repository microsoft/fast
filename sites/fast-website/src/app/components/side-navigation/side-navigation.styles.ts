import { css } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";
import {
    accentFillHover,
    accentForegroundActive,
    foregroundOnAccentRest,
    bodyFont,
    designUnit,
    focusStrokeWidth,
    controlCornerRadius,
} from "@microsoft/fast-components";

export const SideNavigationStyles = css`
    ${display("flex")} :host {
        --design-unit-large: calc(${designUnit} * 5px);
        contain: content;
        font-family: ${bodyFont};
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
        fill: ${foregroundOnAccentRest};
        width: 20px;
        height: 20px;
    }

    .list-item:hover .icon {
        fill: ${accentFillHover};
    }

    .scroll-indicator {
        height: 36px;
        width: calc(${focusStrokeWidth} * 1px);
        background-color: ${foregroundOnAccentRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        margin: calc(${designUnit} * 2px) var(--design-unit-large) 0;
        transition: 300ms ease-in-out;
        transition-property: background-color, height;
    }

    .scroll-indicator-active {
        height: 52px;
        background-color: ${accentForegroundActive};
    }
`;
