import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { designUnit, neutralLayerFloating } from "../design-tokens";
import { heightNumber } from "../styles/index";

export const pickerStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        .region {
            z-index: 1000;
            overflow: hidden;
            display: flex;
        }

        .loaded {
            opacity: 1;
            pointer-events: none;
        }

        .loading-display,
        .no-options-display {
            background: ${neutralLayerFloating};
            width: 100%;
            min-height: calc(${heightNumber} * 1px);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-items: center;
            padding: calc(${designUnit} * 1px);
        }

        .loading-progress {
            width: 42px;
            height: 42px;
        }

        .bottom {
            flex-direction: column;
        }

        .top {
            flex-direction: column-reverse;
        }
    `;
