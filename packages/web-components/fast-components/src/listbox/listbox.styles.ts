import type { ElementStyles } from "@microsoft/fast-element";
import { css } from "@microsoft/fast-element";
import type { FoundationElementTemplate } from "@microsoft/fast-foundation";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
    ListboxElement,
    ListboxOption,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    controlCornerRadius,
    designUnit,
    disabledOpacity,
    fillColor,
    focusStrokeOuter,
    focusStrokeWidth,
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
) => {
    const ListboxOptionTag = context.tagFor(ListboxOption);
    const hostContext = context.name === context.tagFor(ListboxElement) ? "" : ".listbox";

    // The expression interpolations present in this block cause Prettier to generate
    // various formatting bugs.
    // prettier-ignore
    return css`
        ${!hostContext ? display("inline-flex") : ""}

        :host ${hostContext} {
            background: ${fillColor};
            border: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            box-sizing: border-box;
            flex-direction: column;
            padding: calc(${designUnit} * 1px) 0;
        }

        ${!hostContext ? css`
            :host(:focus-within:not([disabled])) {
                border-color: ${focusStrokeOuter};
                box-shadow: 0 0 0
                    calc((${focusStrokeWidth} - ${strokeWidth}) * 1px)
                    ${focusStrokeOuter} inset;
            }

            :host([disabled]) ::slotted(*) {
                cursor: ${disabledCursor};
                opacity: ${disabledOpacity};
                pointer-events: none;
            }
        ` : ``}

        ${hostContext || `:host([size])`} {
            max-height: calc(
                (var(--size) * ${heightNumber} + (${designUnit} * ${strokeWidth} * 2)) * 1px
            );
            overflow-y: auto;
        }

        :host([size="0"]) ${hostContext} {
            max-height: none;
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host(:not([multiple]):${focusVisible}) ::slotted(${ListboxOptionTag}[aria-selected="true"]),
                :host([multiple]:${focusVisible}) ::slotted(${ListboxOptionTag}[aria-checked="true"]) {
                    border-color: ${SystemColors.ButtonText};
                    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) inset ${SystemColors.HighlightText};
                }

                :host(:not([multiple]):${focusVisible}) ::slotted(${ListboxOptionTag}[aria-selected="true"]) {
                    background: ${SystemColors.Highlight};
                    color: ${SystemColors.HighlightText};
                    fill: currentcolor;
                }

                ::slotted(${ListboxOptionTag}[aria-selected="true"]:not([aria-checked="true"])) {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.HighlightText};
                    color: ${SystemColors.HighlightText};
                }
            `
        )
    );
};
