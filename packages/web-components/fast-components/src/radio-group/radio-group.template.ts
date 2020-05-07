import { html, slotted } from "@microsoft/fast-element";
import { RadioGroup } from "./radio-group";

export const RadioGroupTemplate = html<RadioGroup>`
    <template
        role="radiogroup"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
    >
        <slot name="label"></slot>
        <div class="positioning-region" part="positioning-region">
            <slot ${slotted("slottedRadioButtons")}> </slot>
        </div>
    </template>
`;
