import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";

export const virtualListStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    :host {
        display: block;
        contain: size;
    }

    .container {
        background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 100px,
            darkgray 100px,
            darkgray 200px
        );
    }
`;
