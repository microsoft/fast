import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { Search, SearchOptions } from "../search.js";
import { searchTemplate as template } from "../search.template.js";

const styles = () => css`
    :host([hidden]) {
        display: none;
    }
    :host {
        display: inline-block;
    }

    :host {
        font-family: var(--body-font);
        outline: none;
        user-select: none;
    }
    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: var(--neutral-foreground-rest);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-rest);
        height: calc(var(--height-number) * 1px);
        align-items: baseline;
    }
    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(var(--design-unit) * 2px + 1px);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }
    .control::-webkit-search-cancel-button {
        -webkit-appearance: none;
    }
    .control:hover,
    .control:focus-visible,
    .control:disabled,
    .control:active {
        outline: none;
    }
    .clear-button {
        height: calc(100% - 2px);
        opacity: 0;
        margin: 1px;
        background: transparent;
        color: var(--neutral-foreground-rest);
        fill: currentcolor;
        border: none;
        border-radius: calc(var(--control-corner-radius) * 1px);
        min-width: calc(var(--height-number) * 1px);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        outline: none;
        font-family: var(--body-font);
        padding: 0 calc((10 + (var(--design-unit) * 2 * var(--density))) * 1px);
    }
    .clear-button:hover {
        background: var(--neutral-fill-stealth-hover);
    }
    .clear-button:active {
        background: var(--neutral-fill-stealth-active);
    }
    :host([appearance="filled"]) .clear-button:hover {
        background: var(--clear-button-hover);
    }
    :host([appearance="filled"]) .clear-button:active {
        background: var(--clear-button-active);
    }
    .input-wrapper {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
    }
    .label {
        display: block;
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        margin-bottom: 4px;
    }
    .label__hidden {
        display: none;
        visibility: hidden;
    }
    .input-wrapper,
    .start,
    .end {
        align-self: center;
    }
    .start,
    .end {
        display: flex;
        margin: 1px;
        fill: currentcolor;
    }
    ::slotted([slot="end"]) {
        height: 100%;
    }
    .end {
        margin-inline-end: 1px;
        height: calc(100% - 2px);
    }
    ::slotted(svg) {
        width: 16px;
        height: 16px;
        margin-inline-end: 11px;
        margin-inline-start: 11px;
        margin-top: auto;
        margin-bottom: auto;
    }
    :host(:hover:not([disabled])) .root {
        background: var(--neutral-fill-input-hover);
        border-color: var(--accent-fill-hover);
    }
    :host(:active:not([disabled])) .root {
        background: var(--neutral-fill-input-hover);
        border-color: var(--accent-fill-active);
    }
    :host(:focus-within:not([disabled])) .root {
        border-color: var(--focus-stroke-outer);
        box-shadow: 0 0 0 1px var(--focus-stroke-outer) inset;
    }
    .clear-button__hidden {
        opacity: 0;
    }
    :host(:hover:not([disabled], [readonly])) .clear-button,
    :host(:active:not([disabled], [readonly])) .clear-button,
    :host(:focus-within:not([disabled], [readonly])) .clear-button {
        opacity: 1;
    }
    :host(:hover:not([disabled], [readonly])) .clear-button__hidden,
    :host(:active:not([disabled], [readonly])) .clear-button__hidden,
    :host(:focus-within:not([disabled], [readonly])) .clear-button__hidden {
        opacity: 0;
    }
    :host([appearance="filled"]) .root {
        background: var(--fill-color);
    }
    :host([appearance="filled"]:hover:not([disabled])) .root {
        background: var(--neutral-fill-hover);
    }
    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: var(--disabled-cursor);
    }
    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }
    :host([disabled]) .control {
        border-color: var(--neutral-stroke-rest);
    }
`;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        Search.compose<SearchOptions>({
            baseName: "search",
            template,
            shadowOptions: {
                delegatesFocus: true,
            },
            styles,
        })()
    );
