import { css, ElementStyles } from "@microsoft/fast-element";
import {
    AnchoredRegion,
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
} from "../design-tokens.js";

/**
 * Styles for Tooltip
 * @public
 */
export const tooltipStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => {
    const anchoredRegionTag = context.tagFor(AnchoredRegion);
    return css`
            :host {
                contain: size;
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
                /* TODO: a mechanism to manage z-index across components
                    https://github.com/microsoft/fast/issues/3813 */
                z-index: 10000;
            }

            ${anchoredRegionTag} {
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: visible;
                flex-direction: row;
            }

            ${anchoredRegionTag}.right,
            ${anchoredRegionTag}.left {
                flex-direction: column;
            }

            ${anchoredRegionTag}.top .tooltip {
                margin-bottom: 4px;
            }

            ${anchoredRegionTag}.bottom .tooltip {
                margin-top: 4px;
            }

            ${anchoredRegionTag}.left .tooltip {
                margin-right: 4px;
            }

            ${anchoredRegionTag}.right .tooltip {
                margin-left: 4px;
            }

            ${anchoredRegionTag}.top.left .tooltip,
            ${anchoredRegionTag}.top.right .tooltip {
                margin-bottom: 0px;
            }

            ${anchoredRegionTag}.bottom.left .tooltip,
            ${anchoredRegionTag}.bottom.right .tooltip {
                margin-top: 0px;
            }

            ${anchoredRegionTag}.top.left .tooltip,
            ${anchoredRegionTag}.bottom.left .tooltip {
                margin-right: 0px;
            }

            ${anchoredRegionTag}.top.right .tooltip,
            ${anchoredRegionTag}.bottom.right .tooltip {
                margin-left: 0px;
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
};
