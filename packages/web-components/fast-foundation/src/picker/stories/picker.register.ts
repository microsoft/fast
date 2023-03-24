import { css } from "@microsoft/fast-element";
import { FASTPickerListItem } from "../picker-list-item.js";
import { pickerListItemTemplate } from "../picker-list-item.template.js";
import { FASTPickerList } from "../picker-list.js";
import { pickerListTemplate } from "../picker-list.template.js";
import { FASTPickerMenuOption } from "../picker-menu-option.js";
import { pickerMenuOptionTemplate } from "../picker-menu-option.template.js";
import { FASTPickerMenu } from "../picker-menu.js";
import { pickerMenuTemplate } from "../picker-menu.template.js";
import { FASTPicker } from "../picker.js";
import { pickerTemplate } from "../picker.template.js";

const pickerStyles = css`
    :host([hidden]) {
        display: none;
    }
    :host {
        display: inline-flex;
        box-sizing: border-box;
    }
    fast-anchored-region {
        z-index: 1000;
        display: flex;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
    }
    .loaded {
        opacity: 1;
        pointer-events: none;
    }
    .loading-display,
    .no-options-display {
        background: var(--neutral-layer-floating);
        width: 100%;
        min-height: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-items: center;
        padding: calc((10 + (var(--design-unit) * 2 * var(--density))) * 1px);
    }
    .loading-progress {
        width: 42px;
        height: 42px;
    }
    .bottom {
        flex-direction: column;
    }
    .top {
        flex-direction: column-reverse;
    }
`;

const pickerListStyles = css`
    :host {
        min-height: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        display: flex;
        flex-direction: row;
        column-gap: calc(var(--design-unit) * 1px);
        row-gap: calc(var(--design-unit) * 1px);
        flex-wrap: wrap;
        box-sizing: border-box;
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-rest);
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        padding: calc(var(--design-unit) * 1px) calc(var(--design-unit) * 2px);
    }
    :host(:not([disabled]):hover) {
        background: var(--neutral-fill-input-hover);
        border-color: var(--accent-fill-hover);
    }
    :host(:not([disabled]):active) {
        background: var(--neutral-fill-input-active);
        border-color: var(--accent-fill-active);
    }
    :host(:not([disabled]):focus-within) {
        border-color: var(--focus-stroke-outer);
        box-shadow: 0 0 0 1px var(--focus-stroke-outer) inset;
    }
    ::slotted([role="combobox"]) {
        height: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        min-width: 250px;
        width: auto;
        box-sizing: border-box;
        border: none;
        color: var(--neutral-foreground-rest);
        outline: none;
        user-select: none;
        padding: 0 calc(var(--design-unit) * 2px + 1px);
    }
`;

const pickerListItemStyles = css`
    :host {
        display: flex;
        align-items: center;
        justify-items: center;
        font-family: var(--body-font);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid transparent;
        box-sizing: border-box;
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        fill: currentcolor;
        font-size: var(--type-ramp-base-font-size);
        height: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        line-height: var(--type-ramp-base-line-height);
        outline: none;
        overflow: hidden;
        padding: 0 calc(var(--design-unit) * 1px);
        user-select: none;
        white-space: nowrap;
    }
    :host(:focus-visible),
    :host(:hover) {
        background: var(--accent-fill-rest);
        color: var(--foreground-on-accent-rest);
    }
    :host(:focus-visible) {
        border-color: var(--focus-stroke-outer);
    }
`;

const pickerMenuStyles = css`
    :host {
        margin: calc(var(--design-unit) * 1px) 0;
        background: var(--neutral-layer-floating);
        z-index: 1000;
        display: flex;
        width: 100%;
        box-sizing: border-box;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        pointer-events: auto;
        border-radius: calc(var(--control-corner-radius) * 1px);
        padding: calc(var(--design-unit) * 1px) 0;
        border: calc(var(--stroke-width) * 1px) solid transparent;
        box-shadow: var(--elevation-shadow);
    }
    .suggestions-available-alert {
        height: 0;
        opacity: 0;
        overflow: hidden;
    }
`;

const pickerMenuOptionStyles = css`
    :host {
        display: flex;
        align-items: center;
        justify-items: center;
        font-family: var(--body-font);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--focus-stroke-width) * 1px) solid transparent;
        box-sizing: border-box;
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        fill: currentcolor;
        font-size: var(--type-ramp-base-font-size);
        height: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        line-height: var(--type-ramp-base-line-height);
        margin: 0 calc(var(--design-unit) * 1px);
        outline: none;
        overflow: hidden;
        padding: 0 calc(var(--design-unit) * 2.25px);
        user-select: none;
        white-space: nowrap;
    }
    :host(:focus-visible[role="listitem"]) {
        border-color: var(--focus-stroke-outer);
        background: var(--neutral-fill-rest);
        color: var(--neutral-foreground-rest);
    }
    :host(:hover) {
        background: var(--neutral-fill-hover);
        color: var(--neutral-foreground-rest);
    }
    :host([aria-selected="true"]) {
        background: var(--accent-fill-rest);
        color: var(--foreground-on-accent-rest);
    }
`;

FASTPickerList.define({
    name: "fast-picker-list",
    template: pickerListTemplate(),
    styles: pickerListStyles,
});

FASTPickerListItem.define({
    name: "fast-picker-list-item",
    template: pickerListItemTemplate(),
    styles: pickerListItemStyles,
});

FASTPickerMenu.define({
    name: "fast-picker-menu",
    template: pickerMenuTemplate(),
    styles: pickerMenuStyles,
});

FASTPickerMenuOption.define({
    name: "fast-picker-menu-option",
    template: pickerMenuOptionTemplate(),
    styles: pickerMenuOptionStyles,
});

FASTPicker.define({
    name: "fast-picker",
    template: pickerTemplate({
        anchoredRegion: "fast-anchored-region",
        pickerList: "fast-picker-list",
        pickerListItem: "fast-picker-list-item",
        pickerMenu: "fast-picker-menu",
        pickerMenuOption: "fast-picker-menu-option",
        progressRing: "fast-progress-ring",
    }),
    styles: pickerStyles,
});
