import { ElementViewTemplate, html, ref, when } from "@microsoft/fast-element";
import { endSlotTemplate, startSlotTemplate, tagFor } from "../patterns/index.js";
import { MenuItemRole } from "./menu-item.js";
import type { FASTMenuItem, MenuItemOptions } from "./menu-item.js";

const checkboxIndicator = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.37 10.17a.5.5 0 0 0-.74.66l4 4.5c.19.22.52.23.72.02l10.5-10.5a.5.5 0 0 0-.7-.7L7.02 14.27l-3.65-4.1Z"/>
</svg>`;

const radioIndicator = `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-8 7a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z"/>
</svg>`;

const submenuIcon = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
<path d="M5.65 3.15a.5.5 0 0 0 0 .7L9.79 8l-4.14 4.15a.5.5 0 0 0 .7.7l4.5-4.5a.5.5 0 0 0 0-.7l-4.5-4.5a.5.5 0 0 0-.7 0Z"/>
</svg>`;

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
                            ${options.checkboxIndicator || checkboxIndicator}
                        </slot>
                    </span>
                `
            )}
            ${when(
                x => x.role === MenuItemRole.menuitemradio,
                html<FASTMenuItem>`
                    <span part="radio-indicator" class="radio-indicator">
                        <slot name="radio-indicator">
                            ${options.radioIndicator || radioIndicator}
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
                        ${options.submenuIcon ?? submenuIcon}
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
