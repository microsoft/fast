import { elements, ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import type { FASTBreadcrumb } from "./breadcrumb.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTBreadcrumb} component.
 * @public
 */
export function breadcrumbTemplate(): ElementViewTemplate<FASTBreadcrumb> {
    return html<FASTBreadcrumb>`
        <template role="navigation">
            <div role="list" class="list" part="list">
                <slot
                    ${slotted({ property: "slottedBreadcrumbItems", filter: elements() })}
                ></slot>
            </div>
        </template>
    `;
}
