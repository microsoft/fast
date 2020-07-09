import { html } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns/start-end";
import { Button } from "./button";

/**
 * The template for the {@link @microsoft/fast-foundation#(Button:class)} component.
 * @public
 */
export const ButtonTemplate = html<Button>`
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
        ariaAtomic="${x => x.ariaAtomic}"
        ariaBusy="${x => x.ariaBusy}"
        ariaControls="${x => x.ariaControls}"
        ariaCurrent="${x => x.ariaCurrent}"
        ariaDescribedBy="${x => x.ariaDescribedby}"
        ariaDetails="${x => x.ariaDetails}"
        ariaDisabled="${x => x.ariaDisabled}"
        ariaErrormessage="${x => x.ariaErrormessage}"
        ariaExpanded="${x => x.ariaExpanded}"
        ariaFlowto="${x => x.ariaDisabled}"
        ariaHaspopup="${x => x.ariaHaspopup}"
        ariaHidden="${x => x.ariaHidden}"
        ariaInvalid="${x => x.ariaInvalid}"
        ariaKeyshortcuts="${x => x.ariaKeyshortcuts}"
        ariaLabel="${x => x.ariaLabel}"
        ariaLabelledby="${x => x.ariaLabelledby}"
        ariaLive="${x => x.ariaLive}"
        ariaOwns="${x => x.ariaOwns}"
        ariaPressed="${x => x.ariaPressed}"
        ariaRelevant="${x => x.ariaRelevant}"
        ariaRoledescription="${x => x.ariaRoledescription}"
    >
        ${startTemplate}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${endTemplate}
    </button>
`;
