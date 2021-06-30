import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    controlCornerRadius,
    designUnit,
    neutralLayerFloating,
    strokeWidth,
} from "../design-tokens";
import { elevation } from "../styles/index";

export const pickerMenuStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        :host {
            background: ${neutralLayerFloating};
            z-index: 1000;
            display: flex;
            width: 260px;
            max-height: 100%;
            min-height: 58px;
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            pointer-events: auto;
            border-radius: calc(${controlCornerRadius} * 1px);
            padding: calc(${designUnit} * 1px) 0;
            border: calc(${strokeWidth} * 1px) solid transparent;
            ${elevation}
        }

        .suggestions-available-alert {
            height: 0;
            opacity: 0;
            overflow: hidden;
        }

        ::slotted([role="listitem"]) {
            width: 100%;
            height: 58px;
        }

        ::slotted([aria-selected="true"][role="listitem"]) {
            background: ${SystemColors.Highlight};
            border-color: ${SystemColors.ButtonText};
            box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset
                ${SystemColors.HighlightText};
            color: ${SystemColors.HighlightText};
            fill: currentcolor;
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    background: ${SystemColors.Canvas};
                    border-color: ${SystemColors.CanvasText};
                }
            `
        )
    );
