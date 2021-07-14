import { html, ref, slotted, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns";
import type { NumberField, NumberFieldOptions } from "./number-field";
import type { ElementDefinitionContext } from "../design-system";

/**
 * The template for the {@link @microsoft/fast-foundation#(NumberField:class)} component.
 * @public
 */
export const numberFieldTemplate: (
    context: ElementDefinitionContext,
    definition: NumberFieldOptions
) => ViewTemplate<NumberField> = (
    context: ElementDefinitionContext,
    definition: NumberFieldOptions
) => html`
    <template class="${x => (x.readOnly ? "readonly" : "")}">
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
                @change="${x => x.handleChange()}"
                ?autofocus="${x => x.autofocus}"
                ?disabled="${x => x.disabled}"
                list="${x => x.list}"
                maxlength="${x => x.maxlength}"
                minlength="${x => x.minlength}"
                placeholder="${x => x.placeholder}"
                ?readonly="${x => x.readOnly}"
                ?required="${x => x.required}"
                size="${x => x.size}"
                :value="${x => x.value}"
                type="text"
                inputmode="numeric"
                min="${x => x.min}"
                max="${x => x.max}"
                step="${x => x.step}"
                aria-atomic="${x => x.ariaAtomic}"
                aria-busy="${x => x.ariaBusy}"
                aria-controls="${x => x.ariaControls}"
                aria-current="${x => x.ariaCurrent}"
                aria-describedBy="${x => x.ariaDescribedby}"
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
                ${ref("control")}
            />
            ${when(
                x => !x.hideStep && !x.readOnly && !x.disabled,
                html`
                    <div class="controls" part="controls">
                        <div class="step-up" part="step-up" @click="${x => x.stepUp()}">
                            <slot name="step-up-glyph">
                                ${definition.stepUpGlyph || ""}
                            </slot>
                        </div>
                        <div
                            class="step-down"
                            part="step-down"
                            @click="${x => x.stepDown()}"
                        >
                            <slot name="step-down-glyph">
                                ${definition.stepDownGlyph || ""}
                            </slot>
                        </div>
                    </div>
                `
            )}
            ${endTemplate}
        </div>
    </template>
`;
