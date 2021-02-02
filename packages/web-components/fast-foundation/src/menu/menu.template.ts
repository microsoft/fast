import type { ViewTemplate } from "@microsoft/fast-element";
import { html, slotted } from "@microsoft/fast-element";
import type { Menu } from "./menu";

/**
 * The template for the {@link @microsoft/fast-foundation#Menu} component.
 * @public
 */
export const MenuTemplate: ViewTemplate<Menu> = html`
    <template
        role="menu"
        @keydown="${(x, c) => x.handleMenuKeyDown(c.event as KeyboardEvent)}"
        @focusout="${(x, c) => x.handleFocusOut(c.event as FocusEvent)}"
    >
        <slot ${slotted("items")}></slot>
    </template>
`;
