import { css, ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    ElementDefinitionContext,
} from "@microsoft/fast-foundation";
import { accentForegroundRest } from "..";
import {
    bodyFont,
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

        .control {
            background: transparent;
            background-color: transparent;
            border: none;
            padding: 0;
            margin: 0;
            color: ${neutralForegroundRest};
            fill: currentcolor;
        }

        .icon-container {
            display: inline-block;
            position: relative;
            height: inherit;
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

        :host(.highlight) slot[name="empty-icon"] {
            opacity: 0;
        }

        :host(.highlight) slot[name="fill-icon"] {
            cursor: pointer;
            opacity: 1;
        }
    `;
