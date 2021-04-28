import { css } from "@microsoft/fast-element";
import {
    AccentFillRestProperty,
    BackgroundColorProperty,
    FocusOutlineWidthProperty,
    FontSize1Property,
    ForegroundColorProperty,
    LineHeight1Property,
} from "../style/css-properties";

export const HTMLRenderLayerNavigationStyles = css`
    #navigationContainer {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
    }
    #clickDisplay,
    #hoverDisplay {
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
    #clickDisplay.active {
        display: block;
        border: calc(${FocusOutlineWidthProperty} * 1px) solid ${AccentFillRestProperty};
    }
    #hoverDisplay.active {
        display: block;
    }
    #hoverDisplay.active:after {
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
    }
    #hoverDisplay .pill {
        background-color: ${BackgroundColorProperty};
        color: ${ForegroundColorProperty};
    }
`;
