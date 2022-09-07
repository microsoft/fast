import { ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import { whitespaceFilter } from "../utilities/whitespace-filter.js";
import type { FASTSearch, SearchOptions } from "./search.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTSearch:class)} component.
 * @public
 */
export function searchTemplate<T extends FASTSearch>(
    options: SearchOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
        <label
            part="label"
            for="field"
            class="${x =>
                x.defaultSlottedNodes && x.defaultSlottedNodes.length
                    ? "label"
                    : "label label__hidden"}"
        >
            <slot
                ${slotted({
                    property: "defaultSlottedNodes",
                    filter: whitespaceFilter,
                })}
            ></slot>
        </label>
        <div class="control" part="control">
            ${startSlotTemplate(options)}
            <input
                class="field"
                part="field"
                id="field"
                @input="${x => x.handleTextInput()}"
                @change="${x => x.handleChange()}"
                ?autofocus="${x => x.autofocus}"
                ?disabled="${x => x.disabled}"
                list="${x => x.list}"
                maxlength="${x => x.maxlength}"
                minlength="${x => x.minlength}"
                pattern="${x => x.pattern}"
                placeholder="${x => x.placeholder}"
                ?readonly="${x => x.readOnly}"
                ?required="${x => x.required}"
                size="${x => x.size}"
                ?spellcheck="${x => x.spellcheck}"
                :value="${x => x.value}"
                type="search"
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
                ${ref("field")}
            />
            <slot name="clear-button">
                <button
                    class="clear-button ${x => (x.value ? "" : "clear-button__hidden")}"
                    part="clear-button"
                    tabindex="-1"
                    @click=${x => x.handleClearInput()}
                >
                    <slot name="clear-icon">
                        ${options.clearIcon ?? ""}
                    </slot>
                </button>
            </slot>
            ${endSlotTemplate(options)}
        </div>
    `;
}
