import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import {
    bodyFont,
    controlCornerRadius,
    focusStrokeOuter,
    neutralFillRest,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";

export const tooltipStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        :host {
            contain: layout;
            overflow: visible;
            height: 0;
            width: 0;
        }

        .tooltip {
            box-sizing: border-box;
            border-radius: calc(${controlCornerRadius} * 1px);
            border: calc(${strokeWidth} * 1px) solid ${focusStrokeOuter};
            box-shadow: 0 0 0 1px ${focusStrokeOuter} inset;
            background: ${neutralFillRest};
            color: ${neutralForegroundRest};
            padding: 4px;
            height: fit-content;
            width: fit-content;
            font-family: ${bodyFont};
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
            white-space: nowrap;
            ${/* TODO: a mechanism to manage z-index across components
            https://github.com/microsoft/fast/issues/3813 */ ""}
            z-index: 10000;
        }

        fast-anchored-region {
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: visible;
            flex-direction: row;
        }

        fast-anchored-region.right,
        fast-anchored-region.left {
            flex-direction: column;
        }

        fast-anchored-region.top .tooltip {
            margin-bottom: 4px;
        }

        fast-anchored-region.bottom .tooltip {
            margin-top: 4px;
        }

        fast-anchored-region.left .tooltip {
            margin-right: 4px;
        }

        fast-anchored-region.right .tooltip {
            margin-left: 4px;
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host([disabled]) {
                    opacity: 1;
                }
            `
        )
    );
