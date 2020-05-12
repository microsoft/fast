import { children, html, ref, slotted, when } from "@microsoft/fast-element";
import { MenuItem, MenuItemRole } from "./menu-item";

// this template is going to need to have the menu item as DOM and not the host.
// the reason for this is that we need to have the menu item directly next to any
// DOM for nested menu items.
export const MenuItemTemplate = html<MenuItem>`
    <template
        role=${x => x.role}
        aria-checked=${x => (x.role !== MenuItemRole.menuitem ? x.checked : void 0)}
        aria-disabled=${x => x.disabled}
        @keydown=${(x, c) => x.handleMenuItemKeyDown(c.event as KeyboardEvent)}
        @click=${(x, c) => x.handleMenuItemClick(c.event as MouseEvent)}
    >
        <span part="start" ${ref("startContainer")}>
            <slot
                name="start"
                ${ref("start")}
                @slotchange=${x => x.handleStartContentChange()}
            ></slot>
        </span>
        <span class="content" part="content">
            <slot></slot>
        </span>
        <span part="end" ${ref("endContainer")}>
            <slot
                name="end"
                ${ref("end")}
                @slotchange=${x => x.handleEndContentChange()}
            ></slot>
        </span>
    </template>
`;
