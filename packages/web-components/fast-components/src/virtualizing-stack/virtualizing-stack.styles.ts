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
        height: 100%;
    }

    .container {
        overflow: hidden;
    }

    .item-stack {
        width: 200px;
        background: blue;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
`;
