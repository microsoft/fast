import { ElementViewTemplate, html } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { BadgeOptions, FASTBadge } from "./badge.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTBadge:class)} component.
 * @public
 */
export function badgeTemplate<T extends FASTBadge>(
    options: BadgeOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        ${startSlotTemplate(options)}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${endSlotTemplate(options)}
    `;
}
