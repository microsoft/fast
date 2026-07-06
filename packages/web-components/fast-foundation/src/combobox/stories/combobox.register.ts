import { css } from "@microsoft/fast-element";
import chevronIcon from "../../../statics/svg/chevron_down_12_regular.svg";
import { FASTCombobox } from "../combobox.js";
import { comboboxTemplate } from "../combobox.template.js";

const styles = css`
    :host {
        --elevation: 14;
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-rest);
        box-sizing: border-box;
        color: var(--neutral-foreground-rest);
        display: inline-flex;
        font-family: var(--body-font);
        height: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        position: relative;
        user-select: none;
        min-width: 250px;
        outline: none;
        vertical-align: top;
    }

    .listbox {
        box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px)
                rgba(0, 0, 0, calc(0.11 * (2 - var(--background-luminance, 1)))),
            0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px))
                rgba(0, 0, 0, calc(0.13 * (2 - var(--background-luminance, 1))));
        background: var(--neutral-layer-floating);
        border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        box-sizing: border-box;
        display: inline-flex;
        flex-direction: column;
        left: 0;
        padding: calc(var(--design-unit) * 1px) 0;
        overflow-y: auto;
        position: fixed;
        top: 0;
        z-index: 1;
    }

    .listbox[hidden] {
        display: none;
    }

    .control {
        align-items: center;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        font-size: var(--type-ramp-base-font-size);
        font-family: inherit;
        line-height: var(--type-ramp-base-line-height);
        min-height: 100%;
        padding: 0 calc(var(--design-unit) * 2.25px);
        width: 100%;
    }

    :host(:not([disabled]):hover) {
        background: var(--neutral-fill-input-hover);
        border-color: var(--accent-fill-hover);
    }

    :host(:focus-visible) {
        border-color: var(--focus-stroke-outer);
        box-shadow: 0 0 0 calc(var(--focus-stroke-width) * 1px) var(--focus-stroke-outer);
    }

    :host(:focus-visible)
        ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
        box-shadow: 0 0 0 calc(var(--focus-stroke-width) * 1px) inset
            var(--focus-stroke-inner);
        border-color: var(--focus-stroke-outer);
        background: var(--accent-fill-focus);
        color: var(--foreground-on-accent-focus);
    }

    :host([disabled]) {
        cursor: not-allowed;
        opacity: var(--disabled-opacity);
    }

    :host([disabled]) .control {
        cursor: not-allowed;
        user-select: none;
    }

    :host([disabled]:hover) {
        background: var(--neutral-fill-stealth-rest);
        color: var(--neutral-foreground-rest);
        fill: currentcolor;
    }

    :host(:not([disabled])) .control:active {
        background: var(--neutral-fill-input-active);
        border-color: var(--accent-fill-active);
        border-radius: calc(var(--control-corner-radius) * 1px);
    }

    :host([open][position="above"]) .listbox {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    :host([open][position="below"]) .listbox {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    :host([open][position="above"]) .listbox {
        border-bottom: 0;
        bottom: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
    }

    :host([open][position="below"]) .listbox {
        border-top: 0;
        top: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
    }

    .selected-value {
        flex: 1 1 auto;
        font-family: inherit;
        text-align: start;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .indicator {
        flex: 0 0 auto;
        margin-inline-start: 1em;
    }

    slot[name="listbox"] {
        display: none;
        width: 100%;
    }

    :host([open]) slot[name="listbox"] {
        display: flex;
        position: absolute;
        box-shadow: 0 0 calc((var(--elevation) * 0.225px) + 2px)
                rgba(0, 0, 0, calc(0.11 * (2 - var(--background-luminance, 1)))),
            0 calc(var(--elevation) * 0.4px) calc((var(--elevation) * 0.9px))
                rgba(0, 0, 0, calc(0.13 * (2 - var(--background-luminance, 1))));
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }

    ::slotted([slot="start"]) {
        margin-inline-end: 11px;
    }

    ::slotted([slot="end"]) {
        margin-inline-start: 11px;
    }

    ::slotted([role="option"]),
    ::slotted(option) {
        flex: 0 0 auto;
    }

    :host(:empty) .listbox {
        display: none;
    }

    :host([disabled]) *,
    :host([disabled]) {
        cursor: not-allowed;
        user-select: none;
    }

    .selected-value {
        appearance: none;
        background: transparent;
        border: none;
        color: currentcolor;
        font-size: var(--type-ramp-base-font-size);
        height: calc(100% - (var(--stroke-width) * 1px));
        line-height: var(--type-ramp-base-line-height);
        margin: auto 0;
    }

    .selected-value:hover,
    .selected-value:focus-visible,
    .selected-value:disabled,
    .selected-value:active {
        outline: none;
    }
`;

FASTCombobox.define({
    name: "fast-combobox",
    template: comboboxTemplate({
        indicator: chevronIcon,
    }),
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
