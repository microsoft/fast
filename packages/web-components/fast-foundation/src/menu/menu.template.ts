import { html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "../foundation-element";
import type { Menu } from "./menu";

/**
 * The template for the {@link @microsoft/fast-foundation#Menu} component.
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
