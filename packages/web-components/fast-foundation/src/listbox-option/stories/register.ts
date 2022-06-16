import { css } from "@microsoft/fast-element";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { DesignSystem } from "../../design-system/design-system.js";
import { forcedColorsStylesheetBehavior } from "../../utilities/match-media-stylesheet-behavior.js";
import { ListboxOption } from "../listbox-option.js";
import { listboxOptionTemplate as template } from "../listbox-option.template.js";

const styles = () =>
    css`
        :host {
            align-items: center;
            background: var(--neutral-fill-stealth-rest);
            border-radius: calc(var(--control-corner-radius) * 1px);
            border: calc(var(--focus-stroke-width) * 1px) solid transparent;
            box-sizing: border-box;
            color: var(--neutral-foreground-rest);
            cursor: pointer;
            display: inline-flex;
            fill: currentcolor;
            flex: 0 0 auto;
            font: var(--type-ramp-base-font-size) / var(--type-ramp-base-line-height)
                var(--body-font);
            height: calc(var(--height-number) * 1px);
            margin: 0 calc((var(--design-unit) - var(--focus-stroke-width)) * 1px);
            outline: none;
            overflow: hidden;
            padding: 0 1ch;
            user-select: none;
            white-space: nowrap;
        }

        :host(:not([disabled]):not([aria-selected="true"]):hover) {
            background: var(--neutral-fill-stealth-hover);
        }

        :host(:not([disabled]):not([aria-selected="true"]):active) {
            background: var(--neutral-fill-stealth-active);
        }

        :host([aria-selected="true"]) {
            background: var(--accent-fill-rest);
            color: var(--foreground-on-accent-rest);
        }

        :host(:not([disabled])[aria-selected="true"]:hover) {
            background: var(--accent-fill-hover);
            color: var(--foreground-on-accent-hover);
        }

        :host(:not([disabled])[aria-selected="true"]:active) {
            background: var(--accent-fill-active);
            color: var(--foreground-on-accent-active);
        }

        :host([disabled]) {
            cursor: var(--disabled-cursor);
            opacity: var(--disabled-opacity);
        }

        .content {
            grid-column-start: 2;
            justify-self: start;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .start,
        .end,
        ::slotted(svg) {
            display: flex;
        }

        ::slotted(svg) {
            height: calc(var(--design-unit) * 4px);
            width: calc(var(--design-unit) * 4px);
        }

        ::slotted([slot="end"]) {
            margin-inline-start: 1ch;
        }

        ::slotted([slot="start"]) {
            margin-inline-end: 1ch;
        }

        :host([aria-checked="true"][aria-selected="false"]) {
            border-color: var(--focus-stroke-outer);
        }

        :host([aria-checked="true"][aria-selected="true"]) {
            border-color: var(--focus-stroke-outer);
            box-shadow: 0 0 0 calc(var(--focus-stroke-width) * 2 * 1px) inset
                var(--focus-stroke-inner);
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    border-color: transparent;
                    color: ${SystemColors.ButtonText};
                    fill: currentcolor;
                    forced-color-adjust: none;
                }

                :host(:not([aria-selected="true"]):hover),
                :host([aria-selected="true"]) {
                    background: ${SystemColors.Highlight};
                    color: ${SystemColors.HighlightText};
                }

                :host([disabled]),
                :host([disabled][aria-selected="false"]:hover) {
                    background: ${SystemColors.Canvas};
                    color: ${SystemColors.GrayText};
                    fill: currentcolor;
                    opacity: 1;
                }

                :host([aria-checked="true"][aria-selected="false"]) {
                    background: ${SystemColors.ButtonFace};
                    border-color: ${SystemColors.ButtonText};
                    color: ${SystemColors.ButtonText};
                }

                :host([aria-checked="true"][aria-selected="true"]),
                :host([aria-checked="true"][aria-selected="true"]:hover) {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.ButtonText};
                    color: ${SystemColors.HighlightText};
                }
            `
        )
    );

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        ListboxOption.compose({
            baseName: "option",
            template,
            styles,
        })()
    );
