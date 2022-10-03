import type { ElementViewTemplate } from "@microsoft/fast-element";
import { html, when } from "@microsoft/fast-element";
import type { FASTSkeleton } from "./skeleton.js";

/**
 * The template for the fast-skeleton component
 * @public
 */
export function skeletonTemplate<T extends FASTSkeleton>(): ElementViewTemplate<T> {
    return html<T>`
        <template pattern="${x => x.pattern}" ?shimmer="${x => x.shimmer}">
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
}
