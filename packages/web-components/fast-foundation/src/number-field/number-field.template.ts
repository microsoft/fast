import { ElementViewTemplate, html, ref, slotted, when } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { FASTNumberField, NumberFieldOptions } from "./number-field.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTNumberField:class)} component.
 * @public
 */
export function numberFieldTemplate<T extends FASTNumberField>(
    options: NumberFieldOptions = {}
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
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </label>
        <div class="control" part="control">
            ${startSlotTemplate(options)}
            <input
                class="field"
                part="field"
                id="field"
                @input="${x => x.handleTextInput()}"
                @change="${x => x.handleChange()}"
                @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
                @blur="${(x, c) => x.handleBlur()}"
                ?autofocus="${x => x.autofocus}"
                ?disabled="${x => x.disabled}"
                list="${x => x.list}"
                maxlength="${x => x.maxlength}"
                minlength="${x => x.minlength}"
                placeholder="${x => x.placeholder}"
                ?readonly="${x => x.readOnly}"
                ?required="${x => x.required}"
                size="${x => x.size}"
                type="text"
                inputmode="numeric"
                min="${x => x.min}"
                max="${x => x.max}"
                step="${x => x.step}"
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
            ${when(
                x => !x.hideStep && !x.readOnly && !x.disabled,
                html<T>`
                    <div class="step-buttons" part="step-buttons">
                        <div class="step-up" part="step-up" @click="${x => x.stepUp()}">
                            <slot name="step-up-icon">
                                ${options.stepUpIcon ?? ""}
                            </slot>
                        </div>
                        <div
                            class="step-down"
                            part="step-down"
                            @click="${x => x.stepDown()}"
                        >
                            <slot name="step-down-icon">
                                ${options.stepDownIcon ?? ""}
                            </slot>
                        </div>
                    </div>
                `
            )}
            ${endSlotTemplate(options)}
        </div>
    `;
}
