import { css, ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
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
        ${display("inline-block")} :host {
            box-sizing: border-box;
            color: ${neutralForegroundRest};
            fill: currentcolor;
            font-family: ${bodyFont};
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
        }

        .rating-icons {
            display: inline-block;
            position: relative;
        }

        :host(:${focusVisible}) .rating-items {
            box-shadow: 0 0 0 2px ${fillColor}, 0 0 0 4px ${focusStrokeOuter};
        }

        :host([readonly]) slot[name="unchecked-icon"],
        :host([readonly]) slot[name="checked-icon"],
        :host([readonly].rating-checked) slot[name="unchecked-icon"],
        :host([readonly].rating-checked) slot[name="checked-icon"] {
            cursor: ${disabledCursor};
        }

        :host slot[name="unchecked-icon"] {
            display: inline-block;
            width: 100%;
            opacity: 1;
            transition: 0.5s;
        }

        :host slot[name="checked-icon"] {
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

        :host(.highlight) slot[name="unchecked-icon"],
        :host(.rating-checked) slot[name="unchecked-icon"] {
            opacity: 0;
        }

        :host(.highlight) slot[name="checked-icon"],
        :host(.rating-checked) slot[name="checked-icon"] {
            cursor: pointer;
            opacity: 1;
        }
    `;
