import { html, slotted } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { Menu } from "./menu";

/**
 * The template for the {@link @microsoft/fast-foundation#Menu} component.
 * @public
 */
export const MenuTemplate: (context, definition) => ViewTemplate<Menu> = (
    context,
    definition
) => html`
    <${context.tagFor(Menu)}
        slot="${x => (x.isNestedMenu() ? "submenu" : void 0)}"
        role="menu"
        @keydown="${(x, c) => x.handleMenuKeyDown(c.event as KeyboardEvent)}"
        @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
    >
        <slot ${slotted("items")}></slot>
    </${context.tagFor(Menu)}>
`;
