import { html, ref, when } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns/start-end";
import { MenuItem, MenuItemRole } from "./menu-item";

/**
 * The template for the {@link @microsoft/fast-foundation#(MenuItem:class)} component.
 * @deprecated  use createMenuItemTemplate(<prefix>) instead
 * @public
 */
export const MenuItemTemplate: ViewTemplate<MenuItem> = createMenuItemTemplate("fast");

/**
 * Generates a template for the {@link @microsoft/fast-foundation#(MenuItem:class)} component using
 * the provided prefix.
 *
 * @public
 */
export function createMenuItemTemplate(prefix: string): ViewTemplate {
    return html<MenuItem>`
    <template
        role="${x => x.role}"
        aria-haspopup="${x => (x.submenu !== undefined ? "menu" : void 0)}"
        aria-checked="${x => (x.role !== MenuItemRole.menuitem ? x.checked : void 0)}"
        aria-disabled="${x => x.disabled}"
        aria-expanded="${x => x.expanded}"
        @keydown="${(x, c) => x.handleMenuItemKeyDown(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.handleMenuItemClick(c.event as MouseEvent)}"
        @mouseover="${(x, c) => x.handleMouseOver(c.event as MouseEvent)}"
        @mouseout="${(x, c) => x.handleMouseOut(c.event as MouseEvent)}"
        class="${x => (x.disabled ? "disabled" : "")} ${x =>
        x.expanded ? "expanded" : ""}"
    >

            ${when(
                x => x.role === MenuItemRole.menuitemcheckbox,
                html<MenuItem>`
                    <div part="input-container" class="input-container">
                        <span part="checkbox" class="checkbox">
                            <slot name="checkbox-indicator">
                                <svg
                                    aria-hidden="true"
                                    part="checkbox-indicator"
                                    class="checkbox-indicator"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M8.143 12.6697L15.235 4.5L16.8 5.90363L8.23812 15.7667L3.80005 11.2556L5.27591 9.7555L8.143 12.6697Z"
                                    />
                                </svg>
                            </slot>
                        </span>
                    </div>
                `
            )}
            ${when(
                x => x.role === MenuItemRole.menuitemradio,
                html<MenuItem>`
                    <div part="input-container" class="input-container">
                        <span part="radio" class="radio">
                            <slot name="radio-indicator">
                                <span
                                    part="radio-indicator"
                                    class="radio-indicator"
                                ></span>
                            </slot>
                        </span>
                    </div>
                `
            )}
        </div>
        ${startTemplate}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${endTemplate}
        ${when(
            x => x.expanded,
            html<MenuItem>`
                <${prefix}-anchored-region
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
                </${prefix}-anchored-region>
            `
        )}
    </template>
`;
}
