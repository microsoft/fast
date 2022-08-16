import { attr } from "@microsoft/fast-element";
import { css } from "@microsoft/fast-element";
import checkmarkIcon from "../../../statics/svg/checkmark_16_regular.svg";
import chevronRightIcon from "../../../statics/svg/chevron_right_12_regular.svg";
import circleIcon from "../../../statics/svg/circle_16_filled.svg";
import { FASTMenuItem, MenuItemRole, menuItemTemplate } from "../../menu-item/index.js";
// eslint-disable-next-line no-restricted-imports
import { styles as menuItemStyles } from "../../menu-item/stories/menu-item.register.js";
import { FASTMenu } from "../menu.js";
import { menuTemplate } from "../menu.template.js";

const styles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        --elevation: 11;
        background: var(--neutral-layer-floating);
        border: calc(var(--stroke-width) * 1px) solid transparent;
        border-radius: calc(var(--control-corner-radius) * 1px);
        box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px)
                rgba(0, 0, 0, calc(0.11 * (2 - var(--background-luminance, 1)))),
            0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px))
                rgba(0, 0, 0, calc(0.13 * (2 - var(--background-luminance, 1))));
        display: block;
        margin: 0;
        max-width: 368px;
        min-width: 64px;
        padding: calc(var(--design-unit) * 1px) 0;
    }

    :host([slot="submenu"]) {
        margin: 0 calc(var(--design-unit) * 1px);
        width: max-content;
    }
`;

FASTMenu.define({
    name: "fast-menu",
    styles,
    template: menuTemplate(),
});

/**
 * The intent of this example is that a menu item may have a checkbox or radio role, and it may or may not have
 * `start` slot content (typically an icon). If _any_ combination of items in the entire menu have both, there
 * will be two columns at the front of the menu, separate columns for the state indicator and the `start` icons.
 * A menu item should not need to be _both_ a selectable role _and_ have `start` content to apply two column layout.
 *
 * @internal
 */
export class FancyMenu extends FASTMenu {
    public connectedCallback(): void {
        super.connectedCallback();
    }

    protected setItems(): void {
        super.setItems();

        this.menuItems?.filter(this.isMenuItemElement).forEach((item: HTMLElement) => {
            const indentInfo: FancyMenuIndentInfo = this.menuItems!.reduce(
                (accum: FancyMenuIndentInfo, current: HTMLElement) => {
                    const elementValue = FancyMenu.elementIndent(current as HTMLElement);
                    return {
                        hasControl: accum.hasControl || elementValue.hasControl,
                        hasStart: accum.hasStart || elementValue.hasStart,
                    };
                },
                {
                    hasControl: false,
                    hasStart: false,
                }
            );
            const indent: FancyMenuItemColumnCount =
                indentInfo.hasControl && indentInfo.hasStart
                    ? 2
                    : indentInfo.hasControl || indentInfo.hasStart
                    ? 1
                    : 0;

            if (item instanceof FancyMenuItem) {
                item.startColumnCount = indent;
            }
        });
    }

    private static elementIndent(el: HTMLElement): FancyMenuIndentInfo {
        const role = el.getAttribute("role");
        const startSlot = el.querySelector("[slot=start]");

        return {
            hasControl: role !== MenuItemRole.menuitem,
            hasStart: startSlot !== null,
        };
    }
}

/**
 * Type for menu item column count info.
 * @internal
 */
type FancyMenuIndentInfo = { hasControl: boolean; hasStart: boolean };

/**
 * Types of menu item column count.
 * @internal
 */
type FancyMenuItemColumnCount = 0 | 1 | 2;

/**
 * @internal
 */
export class FancyMenuItem extends FASTMenuItem {
    /**
     * @public
     */
    @attr({ attribute: "start-column-count" })
    public startColumnCount: FancyMenuItemColumnCount;

    public connectedCallback(): void {
        super.connectedCallback();

        if (!this.startColumnCount) {
            this.startColumnCount = 1;
        }
    }
}

FancyMenu.define({
    name: "fancy-menu",
    styles,
    template: menuTemplate(),
});

FancyMenuItem.define({
    name: "fancy-menu-item",
    template: menuItemTemplate({
        checkboxIndicator: checkmarkIcon,
        radioIndicator: circleIcon,
        submenuIcon: chevronRightIcon,
    }),
    styles: css`
        ${menuItemStyles} :host {
            --icon-col: minmax(24px, auto);
            display: grid;
            grid-template-columns: var(--icon-col) 1fr var(--icon-col);
            grid-template-rows: auto;
        }

        ::slotted([slot="start"]) {
            margin-inline-end: 0;
        }

        .content {
            grid-column-start: 2;
            justify-self: start;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        :host([start-column-count="0"]) {
            grid-template-columns: auto 1fr var(--icon-col);
        }

        :host([start-column-count="0"]) .content {
            grid-column: 1;
            grid-row: 1;
        }

        :host([start-column-count="0"]) .submenu-icon {
            grid-column: 5;
            grid-row: 1;
        }

        :host([start-column-count="2"]) {
            grid-template-columns:
                var(--icon-col) var(--icon-col) 1fr var(--icon-col)
                var(--icon-col);
        }

        :host([start-column-count="2"]) .content {
            grid-column: 3;
            grid-row: 1;
            margin-inline-start: 10px;
        }

        :host([start-column-count="2"]) .submenu-icon {
            grid-column: 5;
            grid-row: 1;
        }

        :host([start-column-count="2"]) slot[name="start"] {
            grid-column: 2;
        }

        :host([start-column-count="2"]) slot[name="end"] {
            grid-column: 4;
        }

        :host([start-column-count="0"][aria-haspopup="menu"]),
        :host([start-column-count="1"][aria-haspopup="menu"]),
        :host([start-column-count="1"][role="menuitemcheckbox"]),
        :host([start-column-count="1"][role="menuitemradio"]) {
            grid-template-columns: var(--icon-col) auto 1fr var(--icon-col) var(
                    --icon-col
                );
        }

        :host([start-column-count="2"]:not([aria-haspopup="menu"])) slot[name="end"] {
            grid-column: 5;
        }

        :host([aria-haspopup="menu"]) .content,
        :host([role="menuitemcheckbox"]) .content,
        :host([role="menuitemradio"]) .content {
            grid-column-start: 3;
        }

        :host([aria-haspopup="menu"][start-column-count="0"]) .content {
            grid-column-start: 1;
        }

        :host([aria-haspopup="menu"]) slot[name="end"],
        :host([role="menuitemcheckbox"]) slot[name="end"],
        :host([role="menuitemradio"]) slot[name="end"] {
            grid-column-start: 4;
        }
    `,
});
