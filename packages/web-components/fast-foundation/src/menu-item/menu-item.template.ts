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
export function menuItemTemplate<T extends FASTMenuItem>(
    options: MenuItemOptions
): ElementViewTemplate<T> {
    const anchoredRegionTag = tagFor(options.anchoredRegion);
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
        class="${x => (x.disabled ? "disabled" : "")} ${x =>
        x.expanded ? "expanded" : ""} ${x =>
        typeof x.startColumnCount === "number" ? `indent-${x.startColumnCount}` : ""}"
    >
            ${when(
                x => x.role === MenuItemRole.menuitemcheckbox,
                html<FASTMenuItem>`
                    <span part="checkbox-indicator" class="checkbox-indicator">
                        <slot name="checkbox-indicator">
                            ${options.checkboxIndicator ?? ""}
                        </slot>
                    </span>
                `
            )}
            ${when(
                x => x.role === MenuItemRole.menuitemradio,
                html<FASTMenuItem>`
                    <span part="radio-indicator" class="radio-indicator">
                        <slot name="radio-indicator">
                            ${options.radioIndicator ?? ""}
                        </slot>
                    </span>
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
                <span part="submenu-icon" class="submenu-icon">
                    <slot name="submenu-icon">
                        ${options.submenuIcon ?? ""}
                    </slot>
                </span>
            `
        )}
        ${when(
            x => x.expanded,
            html<T>`
                <${anchoredRegionTag}
                    :anchorElement="${x => x}"
                    vertical-positioning-mode="dynamic"
                    vertical-default-position="bottom"
                    vertical-inset="true"
                    horizontal-positioning-mode="dynamic"
                    horizontal-default-position="end"
                    class="submenu"
                    dir="${x => x.currentDirection}"
                    @loaded="${x => x.submenuLoaded()}"
                    ${ref("submenuRegion")}
                    part="submenu"
                >
                    <slot name="submenu"></slot>
                </${anchoredRegionTag}>
            `
        )}
    </template>
    `;
}
