import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import {
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
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

/**
 * Styles for the {@link @microsoft/fast-components#fastListbox | Listbox} component.
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

    return css`
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

        ::slotted([aria-selected="true"]:not([aria-checked="true"])) {
            border-color: ${neutralLayerFloating};
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
