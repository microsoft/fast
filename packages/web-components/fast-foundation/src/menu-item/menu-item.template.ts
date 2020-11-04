import { html, ref, when } from "@microsoft/fast-element";
import { endTemplate, startTemplate } from "../patterns/start-end";
import { MenuItem, MenuItemRole } from "./menu-item";

/**
 * The template for the {@link @microsoft/fast-foundation#(MenuItem:class)} component.
 * @public
 */
export const MenuItemTemplate = html<MenuItem>`
    <template
        role="${x => x.role}"
        aria-checked="${x => (x.role !== MenuItemRole.menuitem ? x.checked : void 0)}"
        aria-disabled="${x => x.disabled}"
        aria-expanded="${x => x.expanded}"
        @keydown="${(x, c) => x.handleMenuItemKeyDown(c.event as KeyboardEvent)}"
        @click="${(x, c) => x.handleMenuItemClick(c.event as MouseEvent)}"
        class="${x => (x.disabled ? "disabled" : "")} ${x =>
            x.expanded ? "expanded" : ""}"
    >
        ${startTemplate}
        <span class="content" part="content">
            <slot></slot>
        </span>
        ${endTemplate}
        ${when(
            x => x.expanded,
            html<MenuItem>`
                <fast-anchored-region
                    vertical-positioning-mode="${x => x.verticalPositioningMode}"
                    vertical-default-position="${x => x.verticalDefaultPosition}"
                    vertical-inset="${x => x.verticalInset}"
                    vertical-scaling="${x => x.verticalScaling}"
                    horizontal-positioning-mode="${x => x.horizontalPositioningMode}"
                    horizontal-default-position="${x => x.horizontalDefaultPosition}"
                    horizontal-scaling="${x => x.horizontalScaling}"
                    horizontal-inset="${x => x.horizontalInset}"
                    dir="${x => x.currentDirection}"
                    ${ref("subMenuRegion")}
                >
                    <div class="nested-menu" part="nested-menu" role="menu">
                        <slot></slot>
                    </div>
                </fast-anchored-region>
            `
        )}
    </template>
`;
