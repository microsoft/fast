import { elements, ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
import type { FASTRadioGroup } from "./radio-group.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTRadioGroup} component.
 * @public
 */
export function radioGroupTemplate(): ElementViewTemplate<FASTRadioGroup> {
    return html<FASTRadioGroup>`
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
}
