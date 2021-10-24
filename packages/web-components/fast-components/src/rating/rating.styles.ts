import { css, ElementStyles } from "@microsoft/fast-element";
import { disabledCursor } from "@microsoft/fast-foundation";
import { display, ElementDefinitionContext } from "@microsoft/fast-foundation";
import { accentForegroundRest } from "..";
import {
    accentFillRest,
    bodyFont,
    disabledOpacity,
    neutralForegroundRest,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";

export const ratingStyles: (context: ElementDefinitionContext) => ElementStyles = (
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

        :host([disabled]),
        :host([readonly]) {
            cursor: ${disabledCursor};
        }

        :host([disabled]) {
            opacity: ${disabledOpacity};
        }

        .positioning-region {
            display: flex;
            flex-wrap: wrap;
        }

        :host([orientation="vertical"]) .positioning-region {
            flex-direction: column;
        }

        :host([orientation="horizontal"]) .positioning-region {
            flex-direction: row;
        }
    `;
