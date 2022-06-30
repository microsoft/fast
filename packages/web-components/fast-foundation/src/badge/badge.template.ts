import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTBadge } from "./badge.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTBadge} component.
 * @public
 */
export function badgeTemplate(): ElementViewTemplate<FASTBadge> {
    return html<FASTBadge>`
        <div class="control" part="control">
            <slot></slot>
        </div>
    `;
}
