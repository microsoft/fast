import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTDivider } from "./divider.js";
import { DividerRole } from "./divider.options.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTDivider} component.
 * @public
 */
export function dividerTemplate<T extends FASTDivider>(): ElementViewTemplate<T> {
    return html<T>`
        <template
            role="${x => x.role}"
            aria-orientation="${x =>
                x.role !== DividerRole.presentation ? x.orientation : void 0}"
        >
            <slot></slot>
        </template>
    `;
}
