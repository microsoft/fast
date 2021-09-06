import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    fillColor,
    layerCornerRadius,
    neutralForegroundRest,
    strokeWidth,
} from "../design-tokens";
import {
    elevationShadowCardActive,
    elevationShadowCardFocus,
    elevationShadowCardHover,
    elevationShadowCardRest,
} from "../styles";

export const cardStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        ${display("block")} :host {
            --elevation: 4;
            display: block;
            contain: content;
            height: var(--card-height, 100%);
            width: var(--card-width, 100%);
            box-sizing: border-box;
            background: ${fillColor};
            border: calc(${strokeWidth} * 1px) solid transparent;
            border-radius: calc(${layerCornerRadius} * 1px);
            box-shadow: ${elevationShadowCardRest};
            color: ${neutralForegroundRest};
        }

        :host(:hover) {
            box-shadow: ${elevationShadowCardHover};
        }

        :host(:active) {
            box-shadow: ${elevationShadowCardActive};
        }

        :host(:focus-within) {
            box-shadow: ${elevationShadowCardFocus};
        }

        :host {
            content-visibility: auto;
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    forced-color-adjust: none;
                    background: ${SystemColors.Canvas};
                    box-shadow: 0 0 0 1px ${SystemColors.CanvasText};
                }
            `
        )
    );
