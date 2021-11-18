import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { designUnit, neutralForegroundRest } from "../design-tokens";

/**
 * Styles for Radio Group
 * @public
 */
export const radioGroupStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    ${display("flex")} :host {
        align-items: flex-start;
        margin: calc(${designUnit} * 1px) 0;
        flex-direction: column;
        color: ${neutralForegroundRest};
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
