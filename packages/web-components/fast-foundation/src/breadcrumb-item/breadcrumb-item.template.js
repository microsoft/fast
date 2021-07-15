import { html, when } from "@microsoft/fast-element";
import { anchorTemplate } from "../anchor";
import { endTemplate, startTemplate } from "../patterns/start-end";
/**
 * The template for the {@link @microsoft/fast-foundation#(BreadcrumbItem:class)} component.
 * @public
 */
export const breadcrumbItemTemplate = (context, definition) => html`
    <div role="listitem" class="listitem" part="listitem">
        ${when(
            x => x.href && x.href.length > 0,
            html`
                ${anchorTemplate(context, definition)}
            `
        )}
        ${when(
            x => !x.href,
            html`
                ${startTemplate}
                <slot></slot>
                ${endTemplate}
            `
        )}
        ${when(
            x => x.separator,
            html`
                <span class="separator" part="separator" aria-hidden="true">
                    <slot name="separator">${definition.separator || ""}</slot>
                </span>
            `
        )}
    </div>
`;
