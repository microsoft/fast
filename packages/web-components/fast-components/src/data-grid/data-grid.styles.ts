import { css } from "@microsoft/fast-element";
import {
    ElementDefinitionContext,
    FoundationElementDefinition,
} from "../../../fast-foundation/dist/fast-foundation";

export const dataGridStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => css`
    :host {
        display: flex;
        position: relative;
        flex-direction: column;
    }
`;
