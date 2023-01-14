import { html } from "@microsoft/fast-element";
import { attr } from "@microsoft/fast-element";
import { css } from "@microsoft/fast-element";
import { FASTMenuItem, MenuItemRole, menuItemTemplate } from "../../menu-item/index.js";
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

    ::slotted(fast-divider) {
        border: none;
        border-top: calc(var(--stroke-width) * 1px) solid
            var(--neutral-stroke-divider-rest);
        box-sizing: content-box;
        height: 0;
        margin: 0;
    }
`;

FASTMenu.define({
    name: "fast-menu",
    styles,
    template: menuTemplate(),
});

export class FancyMenu extends FASTMenu {
    public connectedCallback(): void {
        super.connectedCallback();
    }

    protected setItems(): void {
        super.setItems();

        this.menuItems
            ?.filter(this.isMenuItemElement)
            .forEach((item: HTMLElement, index: number) => {
                const indent: FancyMenuItemColumnCount = this.menuItems!.reduce(
                    (accum, current) => {
                        const elementValue = FancyMenu.elementIndent(
                            current as HTMLElement
                        );

                        return Math.max(
                            accum,
                            elementValue as number
                        ) as FancyMenuItemColumnCount;
                    },
                    0
                );

                if (item instanceof FancyMenuItem) {
                    item.startColumnCount = indent;
                }
            });
    }

    private static elementIndent(el: HTMLElement): FancyMenuItemColumnCount {
        const role = el.getAttribute("role");
        const startSlot = el.querySelector("[slot=start]");

        if (role && role !== MenuItemRole.menuitem) {
            return !startSlot ? 1 : 2;
        }

        return !startSlot ? 0 : 1;
    }
}

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
     * @deprecated - will be removed in a coming ALPHA version
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
        checkboxIndicator: /* html */ html`
            <svg
                part="checkbox-indicator"
                class="checkbox-indicator"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="m8.1 12.7 7.1-8.2 1.6 1.4-8.6 9.9-4.4-4.5 1.5-1.5L8 12.7Z"
                />
            </svg>
        `,
        expandCollapseGlyph: /* html */ html`
            <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                class="expand-collapse-glyph"
                part="expand-collapse-glyph"
            >
                <path
                    d="M5 12.3a1 1 0 0 0 1.6.8L11 8.8a1.5 1.5 0 0 0 0-2.3L6.6 2.2A1 1 0 0 0 5 3v9.3Z"
                />
            </svg>
        `,
        radioIndicator: /* html */ html`
            <span part="radio-indicator" class="radio-indicator"></span>
        `,
    }),
    styles: css`
        :host([hidden]) {
            display: none !important;
        }

        :host {
            --icon-col: minmax(42px, auto);
            align-items: center;
            background: var(--neutral-fill-stealth-rest);
            border-radius: calc(var(--control-corner-radius) * 1px);
            border: calc(var(--focus-stroke-width) * 1px) solid transparent;
            box-sizing: border-box;
            color: var(--neutral-foreground-rest);
            contain: layout;
            cursor: pointer;
            display: grid;
            fill: currentcolor;
            font: var(--type-ramp-base-font-size) / var(--type-ramp-base-line-height)
                var(--body-font);
            grid-template-columns: var(--icon-col) 1fr var(--icon-col);
            grid-template-rows: auto;
            height: calc(var(--height-number) * 1px);
            justify-items: center;
            margin: 0 calc(var(--design-unit) * 1px);
            outline: none;
            overflow: visible;
            padding: 0;
            white-space: nowrap;
        }

        :host(:hover) {
            background: var(--neutral-fill-stealth-hover);
            color: var(--neutral-foreground-rest);
            position: relative;
            z-index: 1;
        }

        :host(:active) {
            background: var(--neutral-fill-stealth-active);
        }

        :host(:focus-visible) {
            border-color: var(--focus-stroke-outer);
            background: var(--neutral-fill-stealth-focus);
            color: var(--neutral-foreground-rest);
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
            margin-inline-start: 10px;
        }

        :host([start-column-count="0"]) .expand-collapse-glyph-container {
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

        :host([start-column-count="2"]) .expand-collapse-glyph-container {
            grid-column: 5;
            grid-row: 1;
        }

        :host([start-column-count="2"]) ::slotted([slot="start"]) {
            grid-column: 2;
        }

        :host([start-column-count="2"]) ::slotted([slot="end"]) {
            grid-column: 4;
        }

        :host([aria-checked="true"]),
        :host(.expanded) {
            background: var(--neutral-fill-rest);
            color: var(--neutral-foreground-rest);
        }

        :host([disabled]) {
            cursor: var(--disabled-cursor);
            opacity: var(--disabled-opacity);
        }

        :host([disabled]:hover) {
            color: var(--neutral-foreground-rest);
            fill: currentcolor;
            background: var(--neutral-fill-stealth-rest);
        }

        .expand-collapse-glyph {
            width: 16px;
            height: 16px;
        }

        ::slotted([slot="start"]),
        ::slotted([slot="end"]) {
            display: flex;
        }

        ::slotted([slot="start"]) {
            margin-inline-start: 10px;
        }

        ::slotted([slot="end"]) {
            margin-inline-end: 10px;
        }

        :host([start-column-count="0"][aria-haspopup="menu"]),
        :host([start-column-count="1"][aria-haspopup="menu"]),
        :host([start-column-count="1"][role="menuitemcheckbox"]),
        :host([start-column-count="1"][role="menuitemradio"]) {
            align-items: center;
            display: grid;
            grid-template-columns: var(--icon-col) auto 1fr var(--icon-col) var(
                    --icon-col
                );
            min-height: 32px;
        }

        :host([start-column-count="2"]:not([aria-haspopup="menu"]))
            ::slotted([slot="end"]) {
            grid-column: 5;
        }

        .input-container,
        .expand-collapse-glyph-container {
            display: none;
        }

        :host([aria-haspopup="menu"]) .expand-collapse-glyph-container,
        :host([role="menuitemcheckbox"]) .input-container,
        :host([role="menuitemradio"]) .input-container {
            display: grid;
            margin-inline-end: 10px;
        }

        :host([aria-haspopup="menu"]) .content,
        :host([role="menuitemcheckbox"]) .content,
        :host([role="menuitemradio"]) .content {
            grid-column-start: 3;
        }

        :host([aria-haspopup="menu"][start-column-count="0"]) .content {
            grid-column-start: 1;
        }

        :host([aria-haspopup="menu"]) ::slotted([slot="end"]),
        :host([role="menuitemcheckbox"]) ::slotted([slot="end"]),
        :host([role="menuitemradio"]) ::slotted([slot="end"]) {
            grid-column-start: 4;
        }

        .expand-collapse,
        .checkbox,
        .radio {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 20px;
            height: 20px;
            box-sizing: border-box;
            outline: none;
            margin-inline-start: 10px;
        }

        .checkbox,
        .radio {
            border: calc(var(--stroke-width) * 1px) solid var(--neutral-foreground-rest);
        }

        :host([aria-checked="true"]) .checkbox,
        :host([aria-checked="true"]) .radio {
            background: var(--accent-fill-rest);
            border-color: var(--accent-fill-rest);
        }

        .checkbox {
            border-radius: calc(var(--control-corner-radius) * 1px);
        }

        .radio {
            border-radius: 999px;
        }

        .checkbox-indicator,
        .radio-indicator,
        .expand-collapse-indicator,
        ::slotted([slot="checkbox-indicator"]),
        ::slotted([slot="radio-indicator"]),
        ::slotted([slot="expand-collapse-indicator"]) {
            display: none;
        }

        ::slotted([slot="end"]:not(svg)) {
            color: var(--neutral-foreground-hint);
            margin-inline-end: 10px;
        }

        :host([aria-checked="true"]) .checkbox-indicator,
        :host([aria-checked="true"]) ::slotted([slot="checkbox-indicator"]) {
            display: block;
            fill: var(--foreground-on-accent-rest);
            height: 100%;
            pointer-events: none;
            width: 100%;
        }

        :host([aria-checked="true"]) .radio-indicator {
            background: var(--foreground-on-accent-rest);
            border-radius: 999px;
            bottom: 4px;
            display: block;
            left: 4px;
            pointer-events: none;
            position: absolute;
            right: 4px;
            top: 4px;
        }

        :host([aria-checked="true"]) ::slotted([slot="radio-indicator"]) {
            display: block;
            pointer-events: none;
        }
    `,
});
