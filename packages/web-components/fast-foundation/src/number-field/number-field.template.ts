import { html, ref, slotted, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns";
import type { FoundationElementTemplate } from "../foundation-element";
import type { NumberField, NumberFieldOptions } from "./number-field";
import { reflectAttributes } from "../directives/reflect-attributes";

/**
 * The template for the {@link @microsoft/fast-foundation#(NumberField:class)} component.
 * @public
 */
export const numberFieldTemplate: FoundationElementTemplate<
    ViewTemplate<NumberField>,
    NumberFieldOptions
> = (context, definition) => html`
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
            ${startSlotTemplate(context, definition)}
            <input
                class="control"
                part="control"
                id="control"
                @input="${x => x.handleTextInput()}"
                @change="${x => x.handleChange()}"
                @keydown="${(x, c) => x.handleKeyDown(c.event as KeyboardEvent)}"
                @blur="${(x, c) => x.handleBlur()}"
                ?autofocus="${x => x.autofocus}"
                ?disabled="${x => x.disabled}"
                ?readonly="${x => x.readOnly}"
                ?required="${x => x.required}"
                type="text"
                inputmode="numeric"
                ${reflectAttributes(
                    "list",
                    "maxlength",
                    "minlength",
                    "placeholder",
                    "size",
                    "min",
                    "max",
                    "step",
                    "aria-atomic",
                    "aria-busy",
                    "aria-controls",
                    "aria-current",
                    "aria-describedby",
                    "aria-details",
                    "aria-disabled",
                    "aria-errormessage",
                    "aria-flowto",
                    "aria-haspopup",
                    "aria-hidden",
                    "aria-invalid",
                    "aria-keyshortcuts",
                    "aria-label",
                    "aria-labelledby",
                    "aria-live",
                    "aria-owns",
                    "aria-relevant",
                    "aria-roledescription"
                )}
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
            ${endSlotTemplate(context, definition)}
        </div>
    </template>
`;
