import { html } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns/start-end";
import { MenuItem, MenuItemRole } from "./menu-item.js";

export const MenuItemTemplate = html<MenuItem>`
    <template
        role=${x => x.role}
        aria-checked=${x => (x.role !== MenuItemRole.menuitem ? x.checked : void 0)}
        aria-disabled=${x => x.disabled}
        @keydown=${(x, c) => x.handleMenuItemKeyDown(c.event as KeyboardEvent)}
        @click=${(x, c) => x.handleMenuItemClick(c.event as MouseEvent)}
        class="${x => (x.disabled ? "disabled" : "")} ${x =>
            x.expanded ? "expanded" : ""}"
    >
        ${startTemplate}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${endTemplate}
    </template>
`;
