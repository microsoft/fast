import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    controlCornerRadius,
    designUnit,
    neutralLayerFloating,
    neutralStrokeDividerRest,
    strokeWidth,
} from "../design-tokens";
import { elevation } from "../styles/index";

export const menuStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        ${display("block")} :host {
            --elevation: 11;
            background: ${neutralLayerFloating};
            border: calc(${strokeWidth} * 1px) solid transparent;
            ${elevation}
            margin: 0;
            border-radius: calc(${controlCornerRadius} * 1px);
            padding: calc(${designUnit} * 1px) 0;
            max-width: 368px;
            min-width: 64px;
        }

        :host([slot="submenu"]) {
            width: max-content;
            margin: 0 calc(${designUnit} * 1px);
        }

        ::slotted(hr) {
            box-sizing: content-box;
            height: 0;
            margin: 0;
            border: none;
            border-top: calc(${strokeWidth} * 1px) solid ${neutralStrokeDividerRest};
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
