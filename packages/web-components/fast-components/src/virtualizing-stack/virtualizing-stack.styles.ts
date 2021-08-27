import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";

export const virtualizingStackStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    :host {
        contain: size;
        display: flex;
        flex-direction: column;
    }

    .item-stack {
        display: flex;
        flex-direction: column;
    }
`;
