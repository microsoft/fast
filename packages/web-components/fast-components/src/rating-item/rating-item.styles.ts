import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    focusVisible,
} from "@microsoft/fast-foundation";
import { accentForegroundRest } from "..";
import {
    bodyFont,
    fillColor,
    focusStrokeOuter,
    neutralForegroundRest,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";

export const ratingItemStyles: (context: ElementDefinitionContext) => ElementStyles = (
    context: ElementDefinitionContext
) =>
    css`
        ${display("inline-flex")} :host {
            box-sizing: border-box;
            color: ${neutralForegroundRest};
            fill: currentcolor;
            font-family: ${bodyFont};
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
        }

        .rating-items {
            display: inline-block;
            position: relative;
            height: inherit;
        }

        :host(:${focusVisible}) .rating-items {
            box-shadow: 0 0 0 2px ${fillColor}, 0 0 0 4px ${focusStrokeOuter};
        }

        :host slot[name="empty-icon"] {
            display: inline-block;
            width: 100%;
            opacity: 1;
            transition: 0.5s;
        }

        :host slot[name="fill-icon"] {
            display: inline-block;
            position: absolute;
            left: 0px;
            top: 0px;
            text-align: center;
            vertical-align: middle;
            overflow: hidden;
            color: ${accentForegroundRest};
            fill: currentcolor;
            opacity: 0;
            transition: 0.5s;
        }

        :host(.highlight) slot[name="empty-icon"],
        :host(.rating-checked) slot[name="empty-icon"] {
            opacity: 0;
        }

        :host(.highlight) slot[name="fill-icon"],
        :host(.rating-checked) slot[name="fill-icon"] {
            cursor: pointer;
            opacity: 1;
        }
    `;
