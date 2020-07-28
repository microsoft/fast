import { html, slotted, elements } from "@microsoft/fast-element";
import { BreadcrumbItem } from "./breadcrumb-item";

/**
 * The template for the {@link @microsoft/fast-foundation#BreadcrumbItem} component.
 * @public
 */
export const BreadcrumbItemTemplate = html<BreadcrumbItem>`
    <div role="listitem" class="listitem-container" part="listitem-container">
        <slot
            ${slotted({ property: "slottedBreadcrumbItems", filter: elements() })}
        ></slot>
        <span
            class="${x => (x.ariaCurrent ? "separator separator-hidden" : "separator")}"
            aria-hidden="true"
        >
            <slot name="separator" part="separator">/</slot>
        </span>
    </div>
`;
