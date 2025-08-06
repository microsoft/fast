import type { ElementViewTemplate } from "@microsoft/fast-element";
import { elements, html, slotted } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { BreadcrumbOptions, FASTBreadcrumb } from "./breadcrumb.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTBreadcrumb:class)} component.
 * @public
 */
export function breadcrumbTemplate<T extends FASTBreadcrumb>(
    options: BreadcrumbOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        <template role="navigation">
            ${startSlotTemplate(options)}
            <span role="list" class="list" part="list">
                <slot
                    ${slotted({ property: "slottedBreadcrumbItems", filter: elements() })}
                ></slot>
            </span>
            ${endSlotTemplate(options)}
        </template>
    `;
}
