import { css } from "@microsoft/fast-element";
import { FASTCombobox } from "../combobox.js";
import { comboboxTemplate } from "../combobox.template.js";
import { chevronDownIcon } from "../../icons.js";

const styles = css`
    :host {
        box-sizing: border-box;
        color: var(--neutral-foreground-rest);
        fill: currentcolor;
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
        --elevation: 14;
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
        max-height: calc(
            var(--max-height) -
                (
                    (var(--base-height-multiplier) + var(--density)) * var(--design-unit) *
                        1px
                )
        );
        padding: calc(var(--design-unit) * 1px) 0;
        overflow-y: auto;
        position: absolute;
        width: 100%;
        z-index: 1;
    }

    .listbox[hidden] {
        display: none;
    }

    .control {
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-rest);
        align-items: center;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        font-size: var(--type-ramp-base-font-size);
        font-family: inherit;
        line-height: var(--type-ramp-base-line-height);
        min-height: 100%;
        padding: 0 calc(var(--design-unit) * 2.25px);
    }

    :host(:not([disabled]):hover) .control {
        background: var(--neutral-fill-input-hover);
        border-color: var(--accent-fill-hover);
    }

    :host(:not([disabled]):active) .control {
        background: var(--neutral-fill-input-active);
        border-color: var(--accent-fill-active);
        border-radius: calc(var(--control-corner-radius) * 1px);
    }

    :host(:focus-visible) .control {
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

    .field {
        flex: 1 1 auto;
        font-family: inherit;
        text-align: start;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .open-close-icon {
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

    .field {
        appearance: none;
        background: transparent;
        border: none;
        color: currentcolor;
        font-size: var(--type-ramp-base-font-size);
        height: calc(100% - (var(--stroke-width) * 1px));
        line-height: var(--type-ramp-base-line-height);
        margin: auto 0;
    }

    .field:hover,
    .field:focus-visible,
    .field:disabled,
    .field:active {
        outline: none;
    }
`;

FASTCombobox.define({
    name: "fast-combobox",
    template: comboboxTemplate({
        openCloseIcon: chevronDownIcon,
    }),
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
