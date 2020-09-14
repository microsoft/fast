import { html, slotted, ref, elements, children } from "@microsoft/fast-element";
import { Select } from "./select";
import { subtree } from './utlities';
import { endTemplate, startTemplate } from '..';

export const SelectTemplate = html<Select>`
    <template
        @oui-option-selection-change="${(x, c) => {
                let v = (c.event.target as any).value;
                x.value = v;
                x.optionSelectionChange(v)
            }
        }"
        class="${x => (x.readOnly ? "readonly" : "")}" open="${x => x.open ? "" : null}"
        ${subtree({property: "options", selector: "fast-option" })}
    >
        <button part="button" class="button" ${ref("button")}>
            ${startTemplate}
            <slot name="button-container">
                <span part="selected-value">
                    <slot name="selected-value">${x => x.value ? x.value : "Choose one..."}</slot>
                </span>
            </slot>
            ${endTemplate}
        </button>
        <slot ${slotted("listbox")} name="listbox">
        </slot>
    </template>
`;