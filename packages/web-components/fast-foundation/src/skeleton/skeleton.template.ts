import { html, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Skeleton } from "./skeleton";
import type { FoundationElementDefinition } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";

/**
 * The template for the fast-skeleton component
 * @public
 */
export const skeletonTemplate: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ViewTemplate<Skeleton> = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => html`
    <template
        class="${x => (x.shape === "circle" ? "circle" : "rect")}"
        pattern="${x => x.pattern}"
        ?shimmer="${x => x.shimmer}"
    >
        ${when(
            x => x.shimmer === true,
            html`
                <span class="shimmer"></span>
            `
        )}
        <object type="image/svg+xml" data="${x => x.pattern}">
            <img class="pattern" src="${x => x.pattern}" />
        </object>
        <slot></slot>
    </template>
`;
