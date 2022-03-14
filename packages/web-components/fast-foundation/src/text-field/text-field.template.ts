import { html, ref, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns";
import { whitespaceFilter } from "../utilities";
import type { FoundationElementTemplate } from "../foundation-element";
import type { TextField, TextFieldOptions } from "./text-field";
import { reflectAttributes } from "../directives/reflect-attributes";

/**
 * The template for the {@link @microsoft/fast-foundation#(TextField:class)} component.
 * @public
 */
export const textFieldTemplate: FoundationElementTemplate<
    ViewTemplate<TextField>,
    TextFieldOptions
> = (context, definition) => html`
    <template
        class="
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
            <slot
                ${slotted({ property: "defaultSlottedNodes", filter: whitespaceFilter })}
            ></slot>
        </label>
        <div class="root" part="root">
            ${startSlotTemplate(context, definition)}
            <input
                class="control"
                part="control"
                id="control"
                @input="${x => x.handleTextInput()}"
                @change="${x => x.handleChange()}"
                ?autofocus="${x => x.autofocus}"
                ?disabled="${x => x.disabled}"
                ?readonly="${x => x.readOnly}"
                ?required="${x => x.required}"
                ?spellcheck="${x => x.spellcheck}"
                :value="${x => x.value}"
                ${reflectAttributes(
                    "list",
                    "maxlength",
                    "minlength",
                    "pattern",
                    "placeholder",
                    "size",
                    "type",
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
            ${endSlotTemplate(context, definition)}
        </div>
    </template>
`;
