import { ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { TextAreaResize } from "./text-area.js";
import type { FASTTextArea } from "./text-area.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTTextArea:class)} component.
 * @public
 */
export function textAreaTemplate(): ElementViewTemplate<FASTTextArea> {
    return html<FASTTextArea>`
        <template
            class="
            ${x => (x.readOnly ? "readonly" : "")}
            ${x => (x.resize !== TextAreaResize.none ? `resize-${x.resize}` : "")}"
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
            <textarea
                part="control"
                class="control"
                id="control"
                ?autofocus="${x => x.autofocus}"
                cols="${x => x.cols}"
                ?disabled="${x => x.disabled}"
                form="${x => x.form}"
                list="${x => x.list}"
                maxlength="${x => x.maxlength}"
                minlength="${x => x.minlength}"
                name="${x => x.name}"
                placeholder="${x => x.placeholder}"
                ?readonly="${x => x.readOnly}"
                ?required="${x => x.required}"
                rows="${x => x.rows}"
                ?spellcheck="${x => x.spellcheck}"
                :value="${x => x.value}"
                aria-atomic="${x => x.ariaAtomic}"
                aria-busy="${x => x.ariaBusy}"
                aria-controls="${x => x.ariaControls}"
                aria-current="${x => x.ariaCurrent}"
                aria-describedby="${x => x.ariaDescribedby}"
                aria-details="${x => x.ariaDetails}"
                aria-disabled="${x => x.ariaDisabled}"
                aria-errormessage="${x => x.ariaErrormessage}"
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
                @input="${(x, c) => x.handleTextInput()}"
                @change="${x => x.handleChange()}"
                ${ref("control")}
            ></textarea>
        </template>
    `;
}
