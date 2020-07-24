import { html } from "@microsoft/fast-element";
import { BreadcrumbItem } from "./breadcrumb-item";

/**
 * The template for the {@link @microsoft/fast-foundation#BreadcrumbItem} component.
 * @public
 */
export const BreadcrumbItemTemplate = html<BreadcrumbItem>`
    <div
        role="listitem"
        class="content"
        part="content"
        tabindex="0"
        aria-current="${x => x.ariaCurrent}"
    >
        <slot></slot>
        <span
            class="separator ${x => (x.ariaCurrent ? "hide" : "")}
            part="separator"
            aria-hidden="true"
        >
            <slot name="separator">${x => x.separator}</slot>
        </span>
    </div>
`;
