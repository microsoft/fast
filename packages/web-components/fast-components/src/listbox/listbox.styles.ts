import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import {
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
    ListboxElement,
    ListboxOption,
} from "@microsoft/fast-foundation";
import type { FoundationElementTemplate } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralLayerFloating,
    neutralStrokeRest,
    strokeWidth,
} from "../design-tokens";
import { heightNumber } from "../styles/size";

/**
 * Styles for the {@link fastListbox} component.
 *
 * @param context - the element definition context
 * @param definition - the foundation element definition
 * @returns The element styles for the listbox component
 *
 * @public
 */
export const listboxStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) => {
    const ListboxOptionTag = context.tagFor(ListboxOption);
    const hostContext = context.name === context.tagFor(ListboxElement) ? "" : ".listbox";

    return css`
        ${!hostContext ? display("inline-flex") : ""} :host ${hostContext} {
            --padding-height: calc(${designUnit} * 1px);
            --border-width: calc(${strokeWidth} * 1px);
            background: ${neutralLayerFloating};
            border: var(--border-width) solid ${neutralStrokeRest};
            border-radius: calc(${controlCornerRadius} * 1px);
            box-sizing: border-box;
            flex-direction: column;
            padding: var(--padding-height) 0;
        }

        ${!hostContext
            ? css`
                  :host(:focus-within:not([disabled])) {
                      border-color: ${focusStrokeOuter};
                      box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px)
                          ${focusStrokeOuter} inset;
                  }
              `
            : ""} ::slotted ([aria-selected="true"]:not([aria-checked="true"])) {
            border-color: ${neutralLayerFloating};
        }

        ${hostContext || `:host([size])`} {
            max-height: calc(
                (var(--size) * ${heightNumber} + ((${designUnit} + ${strokeWidth}) * 2)) *
                    1px
            );
            overflow-y: auto;
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
