import { html, ref, ViewTemplate } from "@microsoft/fast-element";
import type { PickerList } from "./picker-list";

/**
 *
 * @public
 */
export const pickerListTemplate: (context, definition) => ViewTemplate<PickerList> = (
    context,
    definition
) => {
    return html<PickerList>`
        <template 
            slot="list-region"
            role="list" 
            class="picker-list"
        >
            <input
                role="combobox"
                type="text"
                autocapitalize="off"
                autocomplete="off"
                haspopup="list"
                class="input-element"
                aria-label="${x => x.label}"
                aria-labelledby="${x => x.labelledby}"
                ${ref("inputElement")}
            ></input>
            <slot></slot>
        </template>
    `;
};
