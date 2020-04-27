import { html, slotted } from "@microsoft/fast-element";
import { RadioGroup } from "./radio-group";

export const RadioGroupTemplate = html<RadioGroup>`
    <template
        role="radiogroup"
        ?aria-disabled="${x => x.disabled}"
        ?aria-readonly="${x => x.readOnly}"
    >
        <div part="control" class="control">
            <slot ${slotted("slottedRadioButtons")}> </slot>
        </div>
    </template>
`;
