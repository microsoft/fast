import { html } from "@microsoft/fast-element";
import { RadioGroup } from "./radio-group";

export const RadioGroupTemplate = html<RadioGroup>`
    <template
        role="radio"
        ?aria-disabled="${x => x.disabled}"
        ?aria-readonly="${x => x.readOnly}"
        tabindex="${x => (x.disabled ? null : 0)}"
    >
        <div part="control" class="control">
            <slot> </slot>
        </div>
    </template>
`;
