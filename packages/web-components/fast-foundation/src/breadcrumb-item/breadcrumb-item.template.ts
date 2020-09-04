import { html, when } from "@microsoft/fast-element";
import { BreadcrumbItem } from "./breadcrumb-item";
import { Breadcrumb } from "../breadcrumb";
import { endTemplate, startTemplate } from "../patterns/start-end";

/**
 * The template for the {@link @microsoft/fast-foundation#(BreadcrumbItem:class)} component.
 * @public
 */
export const BreadcrumbItemTemplate = html<BreadcrumbItem>`
    <div role="listitem" class="listitem" part="listitem">
        ${when(
            x => x.href && x.href.length > 0,
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
                    aria-label="${x => x.ariaLabel}"
                    aria-labelledby="${x => x.ariaLabelledby}"
                    aria-live="${x => x.ariaLive}"
                    aria-owns="${x => x.ariaOwns}"
                    aria-relevant="${x => x.ariaRelevant}"
                    aria-roledescription="${x => x.ariaRoledescription}"
                >
                    ${startTemplate}
                    <span class="content" part="content">
                        <slot></slot>
                    </span>
                    ${endTemplate}
                </a>
            `
        )}
        ${when(
            x => !x.href,
            html<BreadcrumbItem>`
                ${startTemplate}
                <slot></slot>
                ${endTemplate}
            `
        )}
        ${when(
            x => x.showSeparator,
            html<BreadcrumbItem>`
                <span class="separator" part="separator" aria-hidden="true">
                    <slot name="separator">/</slot>
                </span>
            `
        )}
    </div>
`;
