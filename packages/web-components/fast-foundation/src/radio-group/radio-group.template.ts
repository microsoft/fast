import { html, slotted } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { RadioGroup } from "./radio-group.js";

export const RadioGroupTemplate = html<RadioGroup>`
    <template
        role="radiogroup"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
    >
        <slot name="label"></slot>
        <div
            class="positioning-region ${x =>
                x.orientation === Orientation.horizontal ? "horizontal" : "vertical"}"
            part="positioning-region"
        >
            <slot ${slotted("slottedRadioButtons")}> </slot>
        </div>
    </template>
`;
