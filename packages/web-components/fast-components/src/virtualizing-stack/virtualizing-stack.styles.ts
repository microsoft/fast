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
        contain: size;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        justify-content: flex-start;
    }

    .item-stack {
        justify-content: flex-start;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .top-spacer {
    }

    .bottom-spacer {
    }
`;
