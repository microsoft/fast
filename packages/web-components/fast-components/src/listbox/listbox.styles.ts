import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import {
    DesignToken,
    disabledCursor,
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
    disabledOpacity,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralLayerFloating,
    neutralStrokeRest,
    strokeWidth,
} from "../design-tokens.js";
import { heightNumber } from "../styles/size.js";

/**
 * A reflection of the size attribute.
 *
 * @public
 */
export const listboxSize = DesignToken.create<number>({
    name: "listbox-size",
    cssCustomPropertyName: "size",
});

export const listboxStrokeOffset = DesignToken.create<number>(
    "stroke-offset"
).withDefault(
    target => designUnit.getValueFor(target) * strokeWidth.getValueFor(target) * 2
);

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
            background: ${neutralLayerFloating};
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

        ::slotted([aria-selected="true"][aria-checked="false"]) {
            border-color: ${neutralLayerFloating};
        }

        ${hostContext || `:host([size])`} {
            max-height: calc(
                (${listboxSize} * ${heightNumber} + var(--stroke-offset)) * 1px
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
