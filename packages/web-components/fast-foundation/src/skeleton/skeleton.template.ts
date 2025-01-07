import { html, when } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Skeleton } from "./skeleton.js";

/**
 * The template for the fast-skeleton component
 * @public
 */
export const skeletonTemplate: FoundationElementTemplate<ViewTemplate<Skeleton>> = (
    context,
    definition
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
        <object type="image/svg+xml" data="${x => x.pattern}" role="presentation">
            <img class="pattern" src="${x => x.pattern}" />
        </object>
        <slot></slot>
    </template>
`;
