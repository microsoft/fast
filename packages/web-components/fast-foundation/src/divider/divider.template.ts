import { ElementViewTemplate, html } from "@microsoft/fast-element";
import type { FASTDivider } from "./divider.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTDivider} component.
 * @public
 */
export function dividerTemplate(): ElementViewTemplate<FASTDivider> {
    return html<FASTDivider>`
        <template
            role="${x => x.role}"
            aria-orientation="${x => x.orientation}"
        ></template>
    `;
}
