import { elements, html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { Breadcrumb } from "./breadcrumb";

const defaultBreadcrumbSeparatorTemplate: ViewTemplate<HTMLElement> = html`
    <span slot="separator">/</span>
`;

/**
 * The template for the {@link @microsoft/fast-foundation#Breadcrumb} component.
 * @public
 */
export const BreadcrumbTemplate: ViewTemplate<Breadcrumb> = html`
    <template
        role="navigation"
        :defaultSeparatorTemplate="${defaultBreadcrumbSeparatorTemplate}"
    >
        <div role="list" class="list" part="list">
            <slot
                ${slotted({ property: "slottedBreadcrumbItems", filter: elements() })}
            ></slot>
        </div>
    </template>
`;
