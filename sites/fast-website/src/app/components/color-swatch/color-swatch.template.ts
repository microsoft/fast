import { html, slotted } from "@microsoft/fast-element";
import { whitespaceFilter } from "@microsoft/fast-foundation";
import { ColorSwatch } from "./color-swatch";

export const ColorSwatchTemplate = html<ColorSwatch>`
    <template
        role="radio"
        class="${x =>
            [x.checked && "checked", x.readOnly && "readonly"].filter(Boolean).join("")}"
        aria-checked="${x => x.checked}"
        aria-required="${x => x.required}"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                <div part="checked-indicator" class="checked-indicator"></div>
            </slot>
        </div>
        <label
            part="label"
            class="label ${x => (!x.defaultSlottedNodes?.length ? "label-hidden" : "")}"
        >
            <slot
                ${slotted({
                    property: "defaultSlottedNodes",
                    filter: whitespaceFilter,
                })}
            ></slot>
        </label>
    </template>
`;
