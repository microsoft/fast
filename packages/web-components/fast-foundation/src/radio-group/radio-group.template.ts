import { elements, ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import type { FASTRadioGroup } from "./radio-group.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTRadioGroup} component.
 * @public
 */
export function radioGroupTemplate<T extends FASTRadioGroup>(): ElementViewTemplate<T> {
    return html<T>`
        <template
            role="radiogroup"
            aria-disabled="${x => x.disabled}"
            aria-readonly="${x => x.readOnly}"
            @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
            @keydown="${(x, c) => x.keydownHandler(c.event as KeyboardEvent)}"
            @focusout="${(x, c) => x.focusOutHandler(c.event as FocusEvent)}"
        >
            <slot name="label"></slot>
            <div class="control" part="control">
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
