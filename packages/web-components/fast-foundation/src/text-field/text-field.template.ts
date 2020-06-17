import { html, ref, slotted } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns/start-end";
import { TextField } from "./text-field";

/**
 * The template for the {@link @microsoft/fast-foundation#(TextField:class)} component.
 * @public
 */
export const TextFieldTemplate = html<TextField>`
    <template
        role="textbox"
        appearance="${x => x.appearance}"
        aria-required="${x => x.required}"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
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
                @input=${x => x.handleTextInput()}
                placeholder=${x => x.placeholder}
                ?required=${x => x.required}
                ?disabled=${x => x.disabled}
                ?readonly=${x => x.readOnly}
                value=${x => x.value}
                ${ref("control")}
            />
            ${endTemplate}
        </div>
    </template>
`;
