import { ElementViewTemplate, html, slotted } from "@microsoft/fast-element";
import type { FASTMenu } from "./menu.js";

/**
 * The template for the {@link @microsoft/fast-foundation#FASTMenu} component.
 * @public
 */
export function menuTemplate(): ElementViewTemplate<FASTMenu> {
    return html<FASTMenu>`
        <template
            slot="${x => (x.slot ? x.slot : x.isNestedMenu() ? "submenu" : void 0)}"
            role="menu"
            @keydown="${(x, c) => x.handleMenuKeyDown(c.event as KeyboardEvent)}"
            @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
        >
            <slot ${slotted("items")}></slot>
        </template>
    `;
}
