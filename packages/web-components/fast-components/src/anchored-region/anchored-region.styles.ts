import { css } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "../../../fast-foundation/dist/fast-foundation";

export const anchoredRegionStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    :host {
        contain: layout;
        display: block;
    }
`;
