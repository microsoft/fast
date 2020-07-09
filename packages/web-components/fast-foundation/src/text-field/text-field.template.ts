import { html, ref, slotted } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns";
import { TextField } from "./text-field";

/**
 * The template for the {@link @microsoft/fast-foundation#(TextField:class)} component.
 * @public
 */
export const TextFieldTemplate = html<TextField>`
    <template
        appearance="${x => x.appearance}"
        tabindex="${x => (x.disabled ? null : 0)}"
        class="
            ${x => x.appearance}
            ${x => (x.readOnly ? "readonly" : "")}
        "
    >
        <label
            part="label"
            for="control"
            class="${x =>
                x.defaultSlottedNodes && x.defaultSlottedNodes.length
                    ? "label"
                    : "label label__hidden"}"
        >
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </label>
        <div class="root" part="root">
            ${startTemplate}
            <input
                class="control"
                part="control"
                id="control"
                @input="${x => x.handleTextInput()}"
                placeholder="${x => x.placeholder}"
                ?required="${x => x.required}"
                ?disabled="${x => x.disabled}"
                ?readonly="${x => x.readOnly}"
                value="${x => x.value}"
                type="${x => x.type}"
                ariaAtomic="${x => x.ariaAtomic}"
                ariaBusy="${x => x.ariaBusy}"
                ariaControls="${x => x.ariaControls}"
                ariaCurrent="${x => x.ariaCurrent}"
                ariaDescribedBy="${x => x.ariaDescribedby}"
                ariaDetails="${x => x.ariaDetails}"
                ariaDisabled="${x => x.ariaDisabled}"
                ariaErrormessage="${x => x.ariaErrormessage}"
                ariaFlowto="${x => x.ariaDisabled}"
                ariaHaspopup="${x => x.ariaHaspopup}"
                ariaHidden="${x => x.ariaHidden}"
                ariaInvalid="${x => x.ariaInvalid}"
                ariaKeyshortcuts="${x => x.ariaKeyshortcuts}"
                ariaLabel="${x => x.ariaLabel}"
                ariaLabelledby="${x => x.ariaLabelledby}"
                ariaLive="${x => x.ariaLive}"
                ariaOwns="${x => x.ariaOwns}"
                ariaRelevant="${x => x.ariaRelevant}"
                ariaRoledescription="${x => x.ariaRoledescription}"
                ${ref("control")}
            />
            ${endTemplate}
        </div>
    </template>
`;
