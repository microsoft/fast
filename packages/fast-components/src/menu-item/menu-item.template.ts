import { html, ref } from "@microsoft/fast-element";
import { bool } from "../utilities";
import { MenuItem, MenuItemRole } from "./menu-item";

export const MenuItemTemplate = html<MenuItem>`
    <template
        $role=${x => x.role}
        $aria-checked="${x =>
            x.role !== MenuItemRole.menuitem ? bool(x.checked) : void 0}"
        $aria-disabled="${x => bool(x.disabled)}"
        @keydown=${(x, c) => x.handleMenuItemKeyDown(c.event as KeyboardEvent)}
        @click=${(x, c) => x.handleMenuItemClick(c.event as MouseEvent)}
    >
        <span
            part="before-content"
            ${ref("beforeContentContainer")}
            @slotchange=${x => x.handleBeforeContentChange()}
        >
            <slot
                name="before-content"
                ${ref("beforeContent")}
            ></slot>
        </span>
        <slot></slot>
        <span
            part="after-content"
            ${ref("afterContentContainer")}
            @slotchange=${x => x.handleAfterContentChange()}
        >
            <slot
                name="after-content"
                ${ref("afterContent")}
            ></slot>
        </span>
    </template>
`;
