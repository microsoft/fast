import { html, when, slotted } from "@microsoft/fast-element";
import { BreadcrumbItem } from "./breadcrumb-item";
import { Breadcrumb } from "../breadcrumb";
import { endTemplate, startTemplate } from "../patterns/start-end";

/**
 * The template for the {@link @microsoft/fast-foundation#(BreadcrumbItem:class)} component.
 * @public
 */
export const BreadcrumbItemTemplate = html<BreadcrumbItem>`
    <div role="listitem" class="listitem" part="listitem">
        ${startTemplate}
        <slot
            ${slotted({
                property: "defaultSlottedNodes",
                filter: value =>
                    (value.nodeType === 3 && value.textContent!.trim().length !== 0) ||
                    value.nodeType === 1 ||
                    false,
            })}
        ></slot>
        <slot name="control">
            ${when(
                x => x.defaultSlottedNodes.length === 0,
                html<BreadcrumbItem>`
                    <a
                        class="control"
                        part="control"
                        href="${x => x.href}"
                        aria-current="${x => (x.isCurrent ? "page" : void 0)}"
                    >
                        <span class="content" part="content">
                            ${x => x.name}
                        </span>
                    </a>
                `
            )}
        </slot>
        ${endTemplate}
        ${when(
            x => x.showSeparator,
            html<BreadcrumbItem>`
                <span class="separator" part="separator" aria-hidden="true">
                    <slot name="separator">
                        ${x =>
                            x.parentElement
                                ? (x.parentElement as Breadcrumb).separator
                                : void 0}
                    </slot>
                </span>
            `
        )}
    </div>
`;
