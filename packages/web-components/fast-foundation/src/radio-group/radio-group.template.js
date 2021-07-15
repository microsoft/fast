import { elements, html, slotted } from "@microsoft/fast-element";
import { Orientation } from "@microsoft/fast-web-utilities";
/**
 * The template for the {@link @microsoft/fast-foundation#RadioGroup} component.
 * @public
 */
export const radioGroupTemplate = (context, definition) => html`
    <template
        role="radiogroup"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        @click="${(x, c) => x.clickHandler(c.event)}"
        @keydown="${(x, c) => x.keydownHandler(c.event)}"
        @focusout="${(x, c) => x.focusOutHandler(c.event)}"
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
