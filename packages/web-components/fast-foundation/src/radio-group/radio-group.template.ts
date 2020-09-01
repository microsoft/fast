import { elements, html, slotted } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import { RadioGroup } from "./radio-group";

/**
 * The template for the {@link @microsoft/fast-foundation#RadioGroup} component.
 * @public
 */
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
            <slot
                ${slotted({
                    property: "slottedRadioButtons",
                    filter: elements("[role=radio]"),
                })}
            ></slot>
        </div>
    </template>
`;
