import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import {
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import type { FoundationElementTemplate } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { disabledCursor } from "@microsoft/fast-foundation";
import {
    controlCornerRadius,
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralLayerFloating,
    neutralStrokeRest,
    strokeWidth,
} from "../design-tokens.js";
import { heightNumber } from "../styles/size.js";

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
            background: ${neutralLayerFloating};
            border: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            box-sizing: border-box;
            flex-direction: column;
            padding: calc(${designUnit} * 1px) 0;
        }

        :host(:focus-within:not([disabled])) {
            border-color: ${focusStrokeOuter};
            box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px)
                ${focusStrokeOuter} inset;
        }

        :host([disabled]) ::slotted(*) {
            opacity: ${disabledOpacity};
            cursor: ${disabledCursor};
            pointer-events: none;
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
            :host(:${focusVisible}) ::slotted([aria-selected="true"][role="option"]) {
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.ButtonText};
                box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${SystemColors.HighlightText};
                color: ${SystemColors.HighlightText};
                fill: currentcolor;
            }

            :host(:${focusVisible}) ::slotted([aria-selected="true"][role="option"]) {
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.ButtonText};
                box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${SystemColors.HighlightText};
                color: ${SystemColors.HighlightText};
                fill: currentcolor;
            }
        `
        )
    );
