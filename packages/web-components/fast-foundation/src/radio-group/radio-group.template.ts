import { elements, html, slotted } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import { Orientation } from "@ni/fast-web-utilities";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { RadioGroup } from "./radio-group.js";

/**
 * The template for the {@link @ni/fast-foundation#RadioGroup} component.
 * @public
 */
export const radioGroupTemplate: FoundationElementTemplate<ViewTemplate<RadioGroup>> = (
    context,
    definition
) => html`
    <template
        role="radiogroup"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
        @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
        @focusout="${(x, c) => x.focusOutHandler(c.event as FocusEvent)}"
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
