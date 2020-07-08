import { html, slotted } from "@microsoft/fast-element";
import { Menu } from "./menu";

/**
 * The template for the {@link @microsoft/fast-foundation#Menu} component.
 * @public
 */
export const MenuTemplate = html<Menu>`
    <template
        role="menu"
        @keydown="${(x, c) => x.handleMenuKeyDown(c.event as KeyboardEvent)}"
        @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
    >
        <slot ${slotted("items")}></slot>
    </template>
`;
