import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import {
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import type { FoundationElementTemplate } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    controlCornerRadius,
    designUnit,
    fillColor,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralStrokeRest,
    strokeWidth,
} from "../design-tokens";
import { heightNumber } from "../styles/size";

/**
 * Styles for Listbox
 * @public
 */
export const listboxStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) =>
    css`
        ${display("inline-flex")} :host {
            background: ${fillColor};
            border: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            box-sizing: border-box;
            flex-direction: column;
            padding: calc((${designUnit} * 2) * 1px);
            outline: none;
        }
        :host(:focus-within:not([disabled])) {
            border-color: ${focusStrokeOuter};
            box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter} inset;
        }

        :host([size]) {
            max-height: calc(
                (var(--size) * ${heightNumber} + ((${designUnit} + ${strokeWidth}) * 2)) *
                    1px
            );
            overflow-y: auto;
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host(:${focusVisible}) ::slotted([role="option"][aria-selected="true"]) {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.ButtonText};
                    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${SystemColors.HighlightText};
                    color: ${SystemColors.HighlightText};
                    fill: currentcolor;
                }
                :host(:${focusVisible}) ::slotted([role="option"][aria-selected="true"]) {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.ButtonText};
                    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${SystemColors.HighlightText};
                    color: ${SystemColors.HighlightText};
                    fill: currentcolor;
                }
                ::slotted([role="option"]:not([aria-selected="true"]):not([disabled]):hover) {
                    forced-color-adjust: none;
                    color: ${SystemColors.ButtonText};
                    background: ${SystemColors.ButtonFace};
                    border-color: ${SystemColors.Highlight};
                    box-shadow: none;
                }
            `
        )
    );
