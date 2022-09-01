import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTBadge } from "./badge.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTBadge} component.
 * @public
 */
export function badgeTemplate<T extends FASTBadge>(): ElementViewTemplate<T> {
    return html<T>`
        <div class="control" part="control">
            <slot></slot>
        </div>
    `;
}
