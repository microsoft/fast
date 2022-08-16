import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTCard } from "./card.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTCard} component.
 * @public
 */
export function cardTemplate<T extends FASTCard>(): ElementViewTemplate<T> {
    return html<T>`
        <slot></slot>
    `;
}
