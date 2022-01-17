import { html, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { ElementDefinitionContext } from "../design-system";
import type { FoundationElementDefinition } from "../foundation-element";
import type { LoaderCard } from "./loader-card";

/**
 * The template for the {@link @microsoft/fast-foundation#LoaderCard} component.
 * @public
 */
export const loaderCardTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<LoaderCard> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <slot></slot>
    ${when(
        x => x.preLoad,
        html<LoaderCard>`
            <slot name="load-anim"></slot>
        `
    )}
`;
