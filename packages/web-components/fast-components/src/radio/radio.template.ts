import { html, when } from "@microsoft/fast-element";
import { Radio } from "./radio";

export const RadioTemplate = html<Radio>`
    <template
        role="radio"
        aria-checked="${x => x.checked}"
        aria-required="${x => x.required}"
        aria-disabled="${x => x.disabled}"
        aria-readonly="${x => x.readOnly}"
        tabindex="${x => (x.disabled ? null : 0)}"
        @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
    >
        <div part="control" class="control">
            <slot name="checked-indicator">
                <div part="checked-indicator" class="checked-indicator"></div>
            </slot>
        </div>
        ${when(
            x => x.childNodes.length,
            html` <label part="label" class="label"><slot></slot></label> `
        )}
    </template>
`;
