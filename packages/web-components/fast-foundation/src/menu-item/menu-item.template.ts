import {
    elements,
    ElementViewTemplate,
    html,
    ref,
    slotted,
    when,
} from "@microsoft/fast-element";
import { staticallyCompose } from "../utilities/template-helpers.js";
import { endSlotTemplate, startSlotTemplate } from "../patterns/index.js";
import type { FASTMenuItem, MenuItemOptions } from "./menu-item.js";
import { MenuItemRole } from "./menu-item.options.js";

/**
 * Generates a template for the {@link @microsoft/fast-foundation#(FASTMenuItem:class)} component using
 * the provided prefix.
 *
 * @public
 */
export function menuItemTemplate<T extends FASTMenuItem>(
    options: MenuItemOptions = {}
): ElementViewTemplate<T> {
    return html<T>`
    <template
        aria-haspopup="${x => (x.hasSubmenu ? "menu" : void 0)}"
        aria-checked="${x => (x.role !== MenuItemRole.menuitem ? x.checked : void 0)}"
        aria-disabled="${x => x.disabled}"
        aria-expanded="${x => x.expanded}"
        @keydown="${(x, c) => x.handleMenuItemKeyDown(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.handleMenuItemClick(c.event as MouseEvent)}"
        @mouseover="${(x, c) => x.handleMouseOver(c.event as MouseEvent)}"
        @mouseout="${(x, c) => x.handleMouseOut(c.event as MouseEvent)}"
    >
            ${when(
                x => x.role === MenuItemRole.menuitemcheckbox,
                html<FASTMenuItem>`
                    <div part="input-container" class="input-container">
                        <span part="checkbox" class="checkbox">
                            <slot name="checkbox-indicator">
                                ${staticallyCompose(options.checkboxIndicator)}
                            </slot>
                        </span>
                    </div>
                `
            )}
            ${when(
                x => x.role === MenuItemRole.menuitemradio,
                html<FASTMenuItem>`
                    <div part="input-container" class="input-container">
                        <span part="radio" class="radio">
                            <slot name="radio-indicator">
                                ${staticallyCompose(options.radioIndicator)}
                            </slot>
                        </span>
                    </div>
                `
            )}
        </div>
        ${startSlotTemplate(options)}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${endSlotTemplate(options)}
        ${when(
            x => x.hasSubmenu,
            html<T>`
                <div
                    part="expand-collapse-glyph-container"
                    class="expand-collapse-glyph-container"
                >
                    <span part="expand-collapse" class="expand-collapse">
                        <slot name="expand-collapse-indicator">
                            ${staticallyCompose(options.expandCollapseGlyph)}
                        </slot>
                    </span>
                </div>
            `
        )}
        <span
            ?hidden="${x => !x.expanded}"
            class="submenu-container"
            part="submenu-container"
            ${ref("submenuContainer")}
        >
            <slot name="submenu" ${slotted({
                property: "slottedSubmenu",
                filter: elements("[role='menu']"),
            })}></slot>
        </span>
    </template>
    `;
}
