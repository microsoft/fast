import { css, ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    MenuItemOptions,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillRest,
    bodyFont,
    controlCornerRadius,
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillStealthRest,
    neutralForegroundHint,
    neutralForegroundRest,
    neutralLayer2,
    neutralLayer3,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { DirectionalStyleSheetBehavior, heightNumber } from "../styles/index";

export const menuItemStyles: (
    context: ElementDefinitionContext,
    definition: MenuItemOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: MenuItemOptions) =>
    css`
    ${display("grid")} :host {
        contain: layout;
        overflow: visible;
        font-family: ${bodyFont};
        outline: none;
        box-sizing: border-box;
        height: calc(${heightNumber} * 1px);
        grid-template-columns: minmax(42px, auto) 1fr minmax(42px, auto);
        grid-template-rows: auto;
        justify-items: center;
        align-items: center;
        padding: 0;
        margin: 0 calc(${designUnit} * 1px);
        white-space: nowrap;
        color: ${neutralForegroundRest};
        fill: currentcolor;
        cursor: pointer;
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        border-radius: calc(${controlCornerRadius} * 1px);
        border: calc(${focusStrokeWidth} * 1px) solid transparent;
    }

    :host(.indent-0) {
        grid-template-columns: auto 1fr minmax(42px, auto);
    }
    :host(.indent-0) .content {
        grid-column: 1;
        grid-row: 1;
        margin-inline-start: 10px;
    }
    :host(.indent-2) {
        grid-template-columns: minmax(42px, auto) minmax(42px, auto) 1fr minmax(42px, auto) minmax(42px, auto);
    }
    :host(.indent-2) .content {
        grid-column: 3;
        grid-row: 1;
        margin-inline-start: 10px;
    }
    :host(.indent-2) .expand-collapse-glyph-container {
        grid-column: 5;
        grid-row: 1;
    }
    :host(.indent-2) .start {
        grid-column: 2;
    }
    :host(.indent-2) .end {
        grid-column: 4;
    }

    :host(:${focusVisible}) {
        border-color: ${focusStrokeOuter};
        background: ${neutralLayer3};
        color: ${neutralForegroundRest};
    }

    :host(:hover) {
        background: ${neutralLayer3};
        color: ${neutralForegroundRest};
    }

    :host([aria-checked="true"]),
    :host(:active),
    :host(.expanded) {
        background: ${neutralLayer2};
        color: ${neutralForegroundRest};
    }

    :host([disabled]) {
        cursor: ${disabledCursor};
        opacity: ${disabledOpacity};
    }

    :host([disabled]:hover) {
        color: ${neutralForegroundRest};
        fill: currentcolor;
        background: ${neutralFillStealthRest};
    }

    :host([disabled]:hover) .start,
    :host([disabled]:hover) .end,
    :host([disabled]:hover)::slotted(svg) {
        fill: ${neutralForegroundRest};
    }

    .expand-collapse-glyph {
        ${
            /* Glyph size is temporary - 
            replace when glyph-size var is added */ ""
        } width: 16px;
        height: 16px;
        fill: currentcolor;
    }

    .content {
        grid-column-start: 2;
        justify-self: start;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .start,
    .end {
        display: flex;
        justify-content: center;
    }

    ::slotted(svg) {
        ${
            /* Glyph size and margin-left is temporary - 
            replace when adaptive typography is figured out */ ""
        } width: 16px;
        height: 16px;
    }

    :host(:hover) .start,
    :host(:hover) .end,
    :host(:hover)::slotted(svg),
    :host(:active) .start,
    :host(:active) .end,
    :host(:active)::slotted(svg) {
        fill: ${neutralForegroundRest};
    }

    :host(.indent-1[aria-haspopup="menu"]),
    :host(.indent-1[role="menuitemcheckbox"]),
    :host(.indent-1[role="menuitemradio"]) {
        display: grid;
        grid-template-columns: minmax(42px, auto) auto 1fr minmax(42px, auto) minmax(42px, auto);
        align-items: center;
        min-height: 32px;
    }

    :host(.indent-2:not([aria-haspopup="menu"])) .end {
        grid-column: 5;
    }

    :host .input-container,
    :host .expand-collapse-glyph-container {
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

    :host([aria-haspopup="menu"]) .end,
    :host([role="menuitemcheckbox"]) .end,
    :host([role="menuitemradio"]) .end {
        grid-column-start: 4;
    }

    :host .expand-collapse,
    :host .checkbox,
    :host .radio {
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

    :host .checkbox,
    :host .radio {
        border: calc(${strokeWidth} * 1px) solid ${neutralForegroundRest};
    }

    :host([aria-checked="true"]) .checkbox,
    :host([aria-checked="true"]) .radio {
        background: ${accentFillRest};
        border-color: ${accentFillRest};
    }

    :host .checkbox {
        border-radius: calc(${controlCornerRadius} * 1px);
    }

    :host .radio {
        border-radius: 999px;
    }

    :host .checkbox-indicator,
    :host .radio-indicator,
    :host .expand-collapse-indicator,
    ::slotted([slot="checkbox-indicator"]),
    ::slotted([slot="radio-indicator"]),
    ::slotted([slot="expand-collapse-indicator"]) {
        display: none;
    }

    ::slotted([slot="end"]:not(svg)) {
        margin-inline-end: 10px;
        color: ${neutralForegroundHint}
    }

    :host([aria-checked="true"]) .checkbox-indicator,
    :host([aria-checked="true"]) ::slotted([slot="checkbox-indicator"]) {
        width: 100%;
        height: 100%;
        display: block;
        fill: ${neutralForegroundRest};
        pointer-events: none;
    }

    :host([aria-checked="true"]) .radio-indicator {
        position: absolute;
        top: 4px;
        left: 4px;
        right: 4px;
        bottom: 4px;
        border-radius: 999px;
        display: block;
        background: ${neutralForegroundRest};
        pointer-events: none;
    }

    :host([aria-checked="true"]) ::slotted([slot="radio-indicator"]) {
        display: block;
        pointer-events: none;
    }
`.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
            :host {
                border-color: transparent;
                color: ${SystemColors.ButtonText};
                forced-color-adjust: none;
            }

            :host(:hover) {
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
            }

            :host(:hover) .start,
            :host(:hover) .end,
            :host(:hover)::slotted(svg),
            :host(:active) .start,
            :host(:active) .end,
            :host(:active)::slotted(svg) {
                fill: ${SystemColors.HighlightText};
            }

            :host(.expanded) {
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
            }

            :host(:${focusVisible}) {
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.ButtonText};
                box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${SystemColors.HighlightText};
                color: ${SystemColors.HighlightText};
                fill: currentcolor;
            }

            :host([disabled]),
            :host([disabled]:hover),
            :host([disabled]:hover) .start,
            :host([disabled]:hover) .end,
            :host([disabled]:hover)::slotted(svg) {
                background: ${SystemColors.Canvas};
                color: ${SystemColors.GrayText};
                fill: currentcolor;
                opacity: 1;
            }

            :host .expanded-toggle,
            :host .checkbox,
            :host .radio{
                border-color: ${SystemColors.ButtonText};
                background: ${SystemColors.HighlightText};
            }

            :host([checked="true"]) .checkbox,
            :host([checked="true"]) .radio {
                background: ${SystemColors.HighlightText};
                border-color: ${SystemColors.HighlightText};
            }

            :host(:hover) .expanded-toggle,
            :host(:hover) .checkbox,
            :host(:hover) .radio,
            :host(:${focusVisible}) .expanded-toggle,
            :host(:${focusVisible}) .checkbox,
            :host(:${focusVisible}) .radio,
            :host([checked="true"]:hover) .checkbox,
            :host([checked="true"]:hover) .radio,
            :host([checked="true"]:${focusVisible}) .checkbox,
            :host([checked="true"]:${focusVisible}) .radio {
                border-color: ${SystemColors.HighlightText};
            }

            :host([aria-checked="true"]) {
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
            }

            :host([aria-checked="true"]) .checkbox-indicator,
            :host([aria-checked="true"]) ::slotted([slot="checkbox-indicator"]),
            :host([aria-checked="true"]) ::slotted([slot="radio-indicator"]) {
                fill: ${SystemColors.Highlight};
            }

            :host([aria-checked="true"]) .radio-indicator {
                background: ${SystemColors.Highlight};
            }

            ::slotted([slot="end"]:not(svg)) {
                color: ${SystemColors.ButtonText};
            }

            :host(:hover) ::slotted([slot="end"]:not(svg)),
            :host(:${focusVisible}) ::slotted([slot="end"]:not(svg)) {
                color: ${SystemColors.HighlightText};
            }
        `
        ),

        new DirectionalStyleSheetBehavior(
            css`
                .expand-collapse-glyph {
                    transform: rotate(0deg);
                }
            `,
            css`
                .expand-collapse-glyph {
                    transform: rotate(180deg);
                }
            `
        )
    );
