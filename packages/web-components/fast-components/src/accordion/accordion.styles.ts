import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { designUnit, neutralFillActive, strokeWidth } from "../design-tokens";

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
            border-top: calc(${strokeWidth} * 1px) solid ${neutralFillActive};
        }
    `;
