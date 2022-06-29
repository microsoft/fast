import { ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { ButtonOptions, FASTButton } from "./button.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTButton:class)} component.
 * @public
 */
export function buttonTemplate(
    options: ButtonOptions = {}
): ElementViewTemplate<FASTButton> {
    return html<FASTButton>`
        <button
            class="control"
            part="control"
            ?autofocus="${x => x.autofocus}"
            ?disabled="${x => x.disabled}"
            form="${x => x.formId}"
            formaction="${x => x.formaction}"
            formenctype="${x => x.formenctype}"
            formmethod="${x => x.formmethod}"
            formnovalidate="${x => x.formnovalidate}"
            formtarget="${x => x.formtarget}"
            name="${x => x.name}"
            type="${x => x.type}"
            value="${x => x.value}"
            aria-atomic="${x => x.ariaAtomic}"
            aria-busy="${x => x.ariaBusy}"
            aria-controls="${x => x.ariaControls}"
            aria-current="${x => x.ariaCurrent}"
            aria-describedby="${x => x.ariaDescribedby}"
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
            aria-pressed="${x => x.ariaPressed}"
            aria-relevant="${x => x.ariaRelevant}"
            aria-roledescription="${x => x.ariaRoledescription}"
            ${ref("control")}
        >
            ${startSlotTemplate(options)}
            <span class="content" part="content">
                <slot ${slotted("defaultSlottedContent")}></slot>
            </span>
            ${endSlotTemplate(options)}
        </button>
    `;
}
