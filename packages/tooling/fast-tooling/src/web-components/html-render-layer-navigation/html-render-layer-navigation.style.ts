import { css } from "@microsoft/fast-element";
import {
    AccentFillRestProperty,
    BackgroundColorProperty,
    FocusOutlineWidthProperty,
    FontSize1Property,
    ForegroundColorProperty,
    LineHeight1Property,
} from "../style/css-properties";

export const htmlRenderLayerNavigationStyles = (context, definition) => css`
    .navigation-region {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
    }
    .click-layer,
    .hover-layer {
        display: none;
        position: absolute;
        box-sizing: content-box;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        pointer-events: none;
        margin: calc(${FocusOutlineWidthProperty} * -1px) 0 0
            calc(${FocusOutlineWidthProperty} * -1px);
    }
    .click-layer.active {
        display: block;
        border: calc(${FocusOutlineWidthProperty} * 1px) solid ${AccentFillRestProperty};
    }
    .hover-layer.active {
        display: block;
    }
    .hover-layer.active:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.16;
        border: calc(${FocusOutlineWidthProperty} * 1px) solid ${AccentFillRestProperty};
        background-color: ${AccentFillRestProperty};
    }
    .pill {
        position: absolute;
        box-sizing: border-box;
        top: calc((${LineHeight1Property} + (${FocusOutlineWidthProperty} * 4px)) * -1);
        line-height: ${LineHeight1Property};
        border-radius: calc(${LineHeight1Property} / 2);
        background-color: ${AccentFillRestProperty};
        padding: 0 6px;
        border: calc(${FocusOutlineWidthProperty} * 1px) solid ${AccentFillRestProperty};
        font-size: ${FontSize1Property};
        text-transform: uppercase;
        font-weight: 700;
        color: ${BackgroundColorProperty};
        white-space: nowrap;
    }
    .hover-layer .pill {
        background-color: ${BackgroundColorProperty};
        color: ${ForegroundColorProperty};
    }
`;
