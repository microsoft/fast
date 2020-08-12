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
                        aria-atomic="${x => x.ariaAtomic}"
                        aria-busy="${x => x.ariaBusy}"
                        aria-controls="${x => x.ariaControls}"
                        aria-current="${x => (x.isCurrent ? "page" : void 0)}"
                        aria-describedBy="${x => x.ariaDescribedby}"
                        aria-details="${x => x.ariaDetails}"
                        aria-disabled="${x => x.ariaDisabled}"
                        aria-errormessage="${x => x.ariaErrormessage}"
                        aria-expanded="${x => x.ariaExpanded}"
                        aria-flowto="${x => x.ariaFlowto}"
                        aria-haspopup="${x => x.ariaHaspopup}"
                        aria-hidden="${x => x.ariaHidden}"
                        aria-invalid="${x => x.ariaInvalid}"
                        aria-keyshortcuts="${x => x.ariaKeyshortcuts}"
                        aria-label="${x => x.name}"
                        aria-labelledby="${x => x.ariaLabelledby}"
                        aria-live="${x => x.ariaLive}"
                        aria-owns="${x => x.ariaOwns}"
                        aria-relevant="${x => x.ariaRelevant}"
                        aria-roledescription="${x => x.ariaRoledescription}"
                    >
                        ${startTemplate}
                        <span class="content" part="content">
                            ${x => x.name}
                        </span>
                        ${endTemplate}
                    </a>
                `
            )}
        </slot>
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
