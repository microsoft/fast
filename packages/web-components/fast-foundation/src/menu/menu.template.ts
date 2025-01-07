import { html, slotted } from "@ni/fast-element";
import type { ViewTemplate } from "@ni/fast-element";
import type { FoundationElementTemplate } from "../foundation-element/foundation-element.js";
import type { Menu } from "./menu.js";

/**
 * The template for the {@link @ni/fast-foundation#Menu} component.
 * @public
 */
export const menuTemplate: FoundationElementTemplate<ViewTemplate<Menu>> = (
    context,
    definition
) => html`
    <template
        slot="${x => (x.slot ? x.slot : x.isNestedMenu() ? "submenu" : void 0)}"
        role="menu"
        @keydown="${(x, c) => x.handleMenuKeyDown(c.event as KeyboardEvent)}"
        @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
    >
        <slot ${slotted("items")}></slot>
    </template>
`;
