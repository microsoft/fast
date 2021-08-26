import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { elevationShadowTooltip } from "../styles/index";
import {
    bodyFont,
    controlCornerRadius,
    fillColor,
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
            contain: size;
            overflow: visible;
            height: 0;
            width: 0;
            z-index: 10000;
        }

        .tooltip {
            box-sizing: border-box;
            border-radius: calc(${controlCornerRadius} * 1px);
            border: calc(${strokeWidth} * 1px) solid transparent;
            background: ${fillColor};
            color: ${neutralForegroundRest};
            padding: 4px 12px;
            height: fit-content;
            width: fit-content;
            font-family: ${bodyFont};
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
            white-space: nowrap;
            box-shadow: ${elevationShadowTooltip};
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

        fast-anchored-region.top .tooltip::after,
        fast-anchored-region.bottom .tooltip::after,
        fast-anchored-region.left .tooltip::after,
        fast-anchored-region.right .tooltip::after {
            content: "";
            width: 12px;
            height: 12px;
            background: ${fillColor};
            border-radius: calc(${controlCornerRadius} * 1px);
            position: absolute;
        }

        fast-anchored-region.top .tooltip::after {
            transform: rotate(45deg) translateX(-50%);
            bottom: 4px;
            left: 50%;
        }

        fast-anchored-region.top .tooltip {
            margin-bottom: 12px;
        }

        fast-anchored-region.bottom .tooltip::after {
            transform: rotate(45deg) translateX(-50%);
            top: 12px;
            left: 50%;
        }

        fast-anchored-region.bottom .tooltip {
            margin-top: 12px;
        }

        fast-anchored-region.left .tooltip::after {
            transform: rotate(45deg) translateY(-50%);
            top: 50%;
            right: 12px;
        }

        fast-anchored-region.left .tooltip {
            margin-right: 12px;
        }

        fast-anchored-region.right .tooltip::after {
            transform: rotate(45deg) translateY(-50%);
            top: 50%;
            left: 4px;
        }

        fast-anchored-region.right .tooltip {
            margin-left: 12px;
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host([disabled]) {
                    opacity: 1;
                }
                fast-anchored-region.top .tooltip::after,
                fast-anchored-region.bottom .tooltip::after,
                fast-anchored-region.left .tooltip::after,
                fast-anchored-region.right .tooltip::after {
                    content: "";
                    width: unset;
                    height: unset;
                }
            `
        )
    );
