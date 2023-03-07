import { ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import { whitespaceFilter } from "../utilities/whitespace-filter.js";
import type { FASTTextField, TextFieldOptions } from "./text-field.js";

/**
 * The template for the {@link @microsoft/fast-foundation#(FASTTextField:class)} component.
 * @public
 */
export function textFieldTemplate<T extends FASTTextField>(
    options: TextFieldOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
    <template
    aria-disabled="${x => x.disabled}"
        ?autofocus="${x => x.autofocus}"
        role="textbox"
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
                ${slotted({
                    property: "defaultSlottedNodes",
                    filter: whitespaceFilter,
                })}
            ></slot>
        </label>
        <div class="root" part="root">
            ${startSlotTemplate(options)}
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
                name="${x => x.name}"
                minlength="${x => x.minlength}"
                pattern="${x => x.pattern}"
                placeholder="${x => x.placeholder}"
                ?readonly="${x => x.readOnly}"
                ?required="${x => x.required}"
                size="${x => x.size}"
                ?spellcheck="${x => x.spellcheck}"
                :value="${x => x.value}"
                type="${x => x.type}"
                aria-hidden=${x => x.focused ? "false" : "true"}
                role="none"
                tabindex="-1"
                ${ref("control")}
            />
            ${endSlotTemplate(options)}
        </div>
    </template>
    `;
}
