import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Card } from "./card";
import type { ElementDefinitionContext } from "../design-system";
import type { FoundationElementDefinition } from "../foundation-element";

/**
 * The template for the {@link @microsoft/fast-foundation#Card} component.
 * @public
 */
export const cardTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<Card> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <slot></slot>
`;
