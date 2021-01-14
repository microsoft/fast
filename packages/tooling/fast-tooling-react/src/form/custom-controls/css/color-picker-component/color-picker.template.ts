import { html, ref } from "@microsoft/fast-element";
import { ColorPicker } from "./color-picker";

/**
 * The template for the color picker component.
 * @public
 */
export const ColorPickerTemplate = html<ColorPicker>`
    <template
        class="
            ${x => (x.readOnly ? "readonly" : "")}
        "
        style="--selectedColor-value: ${x => (x.value ? x.value : "transparent")}"
    >
        <div class="root" part="root">
            <fast-text-field
                class="control"
                part="control"
                id="control"
                @input="${x => x.handleTextInput()}"
                @change="${x => x.handleChange()}"
                ?autofocus="${x => x.autofocus}"
                ?disabled="${x => x.disabled}"
                placeholder="${x => x.placeholder}"
                ?readonly="${x => x.readOnly}"
                ?required="${x => x.required}"
                :value="${x => x.value}"
                ${ref("control")}
            >
                <div slot="start" class="selectedColor"></div>
            </fast-text-field>
        </div>
    </template>
`;
