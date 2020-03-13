import { html, when } from "@microsoft/fast-element";
import { Switch } from "./switch";
import { bool } from "../utilities";

export const SwitchTemplate = html<Switch>`
    <template
        role="switch"
        $aria-checked="${x => bool(x.checked)}"
        $aria-required="${x => bool(x.required)}"
        $aria-disabled="${x => bool(x.disabled)}"
        $aria-readonly="${x => bool(x.readOnly)}"
        $tabindex="${x => (bool(x.disabled) ? null : 0)}"
        @keypress="${(x, c) => x.keypressHandler(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.clickHandler(c.event as MouseEvent)}"
    >
        ${when(
            x => x.childNodes.length,
            html`
            <label
                part="label"
                class="label"
                id="switch-label"
            >
                <slot></slot>
            </label>
        `
        )}
        <div
            part="switch"
            class="switch"
        >
            <span class="checked-indicator" part="checked-indicator"></span>
        </div>
        <span class="status-message" part="status-message">
            <span class="checked-message" part="checked-message">
                <slot name="checked-message"></slot>
            </span>
            <span class="unchecked-message" part="unchecked-message">
                <slot name="unchecked-message"></slot>
            </span>
        </span>
    </template>
`;
