import { ElementViewTemplate, html, ref, when } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate, tagFor } from "../patterns/index.js";
import { MenuItemRole } from "./menu-item.js";
import type { FASTMenuItem, MenuItemOptions } from "./menu-item.js";

/**
 * Generates a template for the {@link @microsoft/fast-foundation#(FASTMenuItem:class)} component using
 * the provided prefix.
 *
 * @public
 */
export function menuItemTemplate(
    options: MenuItemOptions
): ElementViewTemplate<FASTMenuItem> {
    const anchoredRegionTag = tagFor(options.anchoredRegion);
    return html<FASTMenuItem>`
    <template
        role="${x => x.role}"
        aria-haspopup="${x => (x.hasSubmenu ? "menu" : void 0)}"
        aria-checked="${x => (x.role !== MenuItemRole.menuitem ? x.checked : void 0)}"
        aria-disabled="${x => x.disabled}"
        aria-expanded="${x => x.expanded}"
        @keydown="${(x, c) => x.handleMenuItemKeyDown(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.handleMenuItemClick(c.event as MouseEvent)}"
        @mouseover="${(x, c) => x.handleMouseOver(c.event as MouseEvent)}"
        @mouseout="${(x, c) => x.handleMouseOut(c.event as MouseEvent)}"
        class="${x => (x.disabled ? "disabled" : "")} ${x =>
        x.expanded ? "expanded" : ""} ${x => `indent-${x.startColumnCount}`}"
    >
            ${when(
                x => x.role === MenuItemRole.menuitemcheckbox,
                html<FASTMenuItem>`
                    <div part="input-container" class="input-container">
                        <span part="checkbox" class="checkbox">
                            <slot name="checkbox-indicator">
                                ${options.checkboxIndicator || ""}
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
                                ${options.radioIndicator || ""}
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
            html<FASTMenuItem>`
                <div
                    part="expand-collapse-glyph-container"
                    class="expand-collapse-glyph-container"
                >
                    <span part="expand-collapse" class="expand-collapse">
                        <slot name="expand-collapse-indicator">
                            ${options.expandCollapseGlyph || ""}
                        </slot>
                    </span>
                </div>
            `
        )}
        ${when(
            x => x.expanded,
            html<FASTMenuItem>`
                <${anchoredRegionTag}
                    :anchorElement="${x => x}"
                    vertical-positioning-mode="dynamic"
                    vertical-default-position="bottom"
                    vertical-inset="true"
                    horizontal-positioning-mode="dynamic"
                    horizontal-default-position="end"
                    class="submenu-region"
                    dir="${x => x.currentDirection}"
                    @loaded="${x => x.submenuLoaded()}"
                    ${ref("submenuRegion")}
                    part="submenu-region"
                >
                    <slot name="submenu"></slot>
                </${anchoredRegionTag}>
            `
        )}
    </template>
    `;
}
