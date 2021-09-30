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
        background: repeating-linear-gradient(
            0deg,
            gray,
            gray 100px,
            darkgray 100px,
            darkgray 200px
        );
    }

    .item-stack {
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
`;
