import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { designUnit, neutralFillActive } from "../design-tokens";

/**
 * Styles for Accordion
 * @public
 */
export const accordionStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        ${display("flex")} :host {
            box-sizing: border-box;
            flex-direction: column;
            gap: calc(${designUnit} * 1px);
            position: relative;
        }
        :host::before {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            content: "";
            background: ${neutralFillActive};
            width: calc(100% - 40px);
            height: 1px;
        }
    `;
