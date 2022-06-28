import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { TreeItem } from "../tree-item.js";
import { treeItemTemplate as template } from "../tree-item.template.js";

const styles = () => css`
    :host([hidden]) {
        display: none;
    }
    :host {
        display: block;
    }
    :host {
        contain: content;
        position: relative;
        outline: none;
        color: var(--neutral-foreground-rest);
        background: var(--neutral-fill-stealth-rest);
        cursor: pointer;
        font-family: var(--body-font);
        --expand-collapse-button-size: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        --tree-item-nested-width: 0;
    }

    :host(:focus) > .positioning-region {
        outline: none;
    }

    :host(:focus) .content-region {
        outline: none;
    }

    :host(:focus-visible) .positioning-region {
        border: var(--focus-stroke-outer) calc(var(--stroke-width) * 1px) solid;
        border-radius: calc(var(--control-corner-radius) * 1px);
        color: var(--neutral-foreground-rest);
    }

    .positioning-region {
        display: flex;
        position: relative;
        box-sizing: border-box;
        border: transparent calc(var(--stroke-width) * 1px) solid;
        height: calc(
            ((var(--base-height-multiplier) + var(--density)) * var(--design-unit) + 1) *
                1px
        );
    }

    .positioning-region::before {
        content: "";
        display: block;
        width: var(--tree-item-nested-width);
        flex-shrink: 0;
    }

    .positioning-region:hover {
        background: var(--neutral-fill-stealth-hover);
    }

    .positioning-region:active {
        background: var(--neutral-fill-stealth-active);
    }

    .content-region {
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        width: 100%;
        height: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        margin-inline-start: calc(var(--design-unit) * 2px + 8px);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        font-weight: 400;
    }

    .items {
        display: none;
        font-size: calc(1em + (var(--design-unit) + 16) * 1px);
    }

    .expand-collapse-button {
        background: none;
        border: none;
        outline: none;
        width: calc(
            (
                    ((var(--base-height-multiplier) / 2) * var(--design-unit)) +
                        ((var(--design-unit) * var(--density)) / 2) +
                        (var(--design-unit) * 2)
                ) * 1px
        );
        height: calc(
            (
                    ((var(--base-height-multiplier) / 2) * var(--design-unit)) +
                        ((var(--design-unit) * var(--density)) / 2) +
                        (var(--design-unit) * 2)
                ) * 1px
        );
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-left: 6px;
        margin-right: 6px;
    }

    .expand-collapse-glyph {
        width: 16px;
        height: 16px;
        transition: transform 0.1s linear;

        pointer-events: none;
        fill: currentcolor;
    }

    .start,
    .end {
        display: flex;
        fill: currentcolor;
    }

    ::slotted(svg) {
        width: 16px;
        height: 16px;
    }

    .start {
        margin-inline-end: calc(var(--design-unit) * 2px + 2px);
    }

    .end {
        margin-inline-start: calc(var(--design-unit) * 2px + 2px);
    }

    :host([expanded]) > .items {
        display: block;
    }

    :host([disabled]) .content-region {
        opacity: var(--disabled-opacity);
        cursor: not-allowed;
    }

    :host(.nested) .content-region {
        position: relative;
        margin-inline-start: var(--expand-collapse-button-size);
    }

    :host(.nested) .expand-collapse-button {
        position: absolute;
        right: 100%;
    }

    :host(.nested) .expand-collapse-button:hover {
        background: var(--tree-item-expand-collapse-hover);
    }

    :host([selected]) .positioning-region {
        background: var(--neutral-fill-rest);
    }

    :host([selected]) .expand-collapse-button:hover {
        background: var(--tree-item-expand-collapse-selected-hover);
    }

    :host([selected])::after {
        background: var(--accent-foreground-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        content: "";
        display: block;
        position: absolute;
        top: calc(((var(--base-height-multiplier)) * var(--design-unit) / 4) * 1px);
        width: 3px;
        height: calc(((var(--base-height-multiplier)) * var(--design-unit) / 2) * 1px);
    }

    ::slotted(fast-tree-item) {
        --tree-item-nested-width: 1em;
        --expand-collapse-button-nested-width: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * -1px
        );
    }

    .expand-collapse-glyph {
        transform: rotate(0deg);
    }
    :host(.nested) .expand-collapse-button {
        right: 100%;
    }
    :host([selected])::after {
        left: calc(var(--focus-stroke-width) * 1px);
    }
    :host([expanded]) > .positioning-region .expand-collapse-glyph {
        transform: rotate(45deg);
    }
`;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        TreeItem.compose({
            baseName: "tree-item",
            styles,
            template,
            expandCollapseGlyph: /* html */ `
                <svg
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                    class="expand-collapse-glyph"
                >
                    <path
                        d="M5 12.3a1 1 0 0 0 1.6.8L11 8.8a1.5 1.5 0 0 0 0-2.3L6.6 2.2A1 1 0 0 0 5 3v9.3Z"
                    />
                </svg>
            `,
        })()
    );
