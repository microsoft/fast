import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import type {
    FoundationElementDefinition,
    FoundationElementTemplate,
} from "../foundation-element";
import type { Card } from "./card";

/**
 * The template for the {@link @microsoft/fast-foundation#Card} component.
 * @public
 */
export const cardTemplate: FoundationElementTemplate<ViewTemplate<Card>> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <slot></slot>
`;
