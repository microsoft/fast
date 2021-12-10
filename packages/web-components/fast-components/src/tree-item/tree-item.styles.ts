import { css, cssPartial, ElementStyles } from "@microsoft/fast-element";
import {
    DesignToken,
    disabledCursor,
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    TreeItem,
    TreeItemOptions,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { Swatch } from "../color/swatch";
import {
    accentFillRest,
    baseHeightMultiplier,
    bodyFont,
    controlCornerRadius,
    density,
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillRecipe,
    neutralFillStealthActive,
    neutralFillStealthFocus,
    neutralFillStealthHover,
    neutralFillStealthRecipe,
    neutralFillStealthRest,
    neutralForegroundActive,
    neutralForegroundHover,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { DirectionalStyleSheetBehavior, heightNumber } from "../styles/index";

const ltr = css`
    .expand-collapse-button svg {
        transform: rotate(0deg);
    }

    :host(.nested) .expand-collapse-button {
        left: var(--expand-collapse-button-nested-width, calc(${heightNumber} * -1px));
    }

    :host([expanded]) > .positioning-region .expand-collapse-button svg {
        transform: rotate(90deg);
    }
`;

const rtl = css`
    .expand-collapse-button svg {
        transform: rotate(180deg);
    }

    :host(.nested) .expand-collapse-button {
        right: var(--expand-collapse-button-nested-width, calc(${heightNumber} * -1px));
    }

    :host([expanded]) > .positioning-region .expand-collapse-button svg {
        transform: rotate(270deg);
    }
`;

/**
 * Tree item expand collapse button size CSS Partial
 * @public
 */
export const expandCollapseButtonSize = cssPartial`((${baseHeightMultiplier} / 2) * ${designUnit}) + ((${designUnit} * ${density}) / 2)`;

const expandCollapseHoverBehavior = DesignToken.create<Swatch>(
    "tree-item-expand-collapse-hover"
).withDefault((target: HTMLElement) => {
    const recipe = neutralFillStealthRecipe.getValueFor(target);
    return recipe.evaluate(target, recipe.evaluate(target).hover).hover;
});

const selectedExpandCollapseHoverBehavior = DesignToken.create<Swatch>(
    "tree-item-expand-collapse-selected-hover"
).withDefault((target: HTMLElement) => {
    const baseRecipe = neutralFillRecipe.getValueFor(target);
    const buttonRecipe = neutralFillStealthRecipe.getValueFor(target);
    return buttonRecipe.evaluate(target, baseRecipe.evaluate(target).rest).hover;
});

/**
 * Styles for Tree Item
 * @public
 */
export const treeItemStyles: (
    context: ElementDefinitionContext,
    definition: TreeItemOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: TreeItemOptions) =>
    css`
        ${display("block")} :host {
            --expand-collapse-button-size: calc(${heightNumber} * 1px);
            --tree-item-nested-width: 0;
            contain: content;
            position: relative;
            outline: none;
            color: ${neutralForegroundRest};
            fill: currentcolor;
            cursor: pointer;
            font-family: ${bodyFont};
        }

        :host(:focus) > .positioning-region,
        :host(:focus) .content-region {
            outline: none;
        }

        .positioning-region {
            display: flex;
            position: relative;
            box-sizing: border-box;
            background: ${neutralFillStealthRest};
            border: calc(${strokeWidth} * 1px) solid transparent;
            border-radius: calc(${controlCornerRadius} * 1px);
            height: calc((${heightNumber} + 1) * 1px);
        }

        :host(:not([disabled])) .positioning-region:hover {
            background: ${neutralFillStealthHover};
            color: ${neutralForegroundHover};
        }

        :host(:not([disabled])) .positioning-region:active {
            background: ${neutralFillStealthActive};
            color: ${neutralForegroundActive};
        }

        :host(:${focusVisible}) .positioning-region {
            background: ${neutralFillStealthFocus};
            border-color: ${focusStrokeOuter};
            box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter} inset;
            color: ${neutralForegroundHover};
        }

        :host(:not([disabled])[selected]) .positioning-region {
            background: ${neutralFillStealthRest};
            border-color: ${accentFillRest};
            color: ${neutralForegroundActive};
        }

        .positioning-region::before {
            content: "";
            display: block;
            width: var(--tree-item-nested-width);
            flex-shrink: 0;
        }

        .content-region {
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
            width: 100%;
            height: calc(${heightNumber} * 1px);
            margin-inline-start: calc(${designUnit} * 2px + 8px);
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
            font-weight: 400;
        }

        .items {
            display: none;
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            font-size: calc(1em + (${designUnit} + 16) * 1px);
        }

        .expand-collapse-button {
            background: none;
            border: none;
            border-radius: calc(${controlCornerRadius} * 1px);
            outline: none;
            /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
            width: calc((${expandCollapseButtonSize} + (${designUnit} * 2)) * 1px);
            height: calc((${expandCollapseButtonSize} + (${designUnit} * 2)) * 1px);
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin: 0 6px;
        }

        .expand-collapse-button svg {
            transition: transform 0.1s linear;
            pointer-events: none;
        }

        .start,
        .end {
            display: flex;
        }

        .start {
            /* TODO: horizontalSpacing https://github.com/microsoft/fast/issues/2766 */
            margin-inline-end: calc(${designUnit} * 2px + 2px);
        }

        .end {
            /* TODO: horizontalSpacing https://github.com/microsoft/fast/issues/2766 */
            margin-inline-start: calc(${designUnit} * 2px + 2px);
        }

        :host([expanded]) .items {
            display: block;
        }

        :host([disabled]) {
            opacity: ${disabledOpacity};
            cursor: ${disabledCursor};
        }

        :host(.nested) .content-region {
            position: relative;
            margin-inline-start: var(--expand-collapse-button-size);
        }

        :host(.nested) .expand-collapse-button {
            position: absolute;
        }

        :host(.nested) .expand-collapse-button:hover {
            background: ${expandCollapseHoverBehavior};
        }

        :host(:not([disabled])[selected]) .expand-collapse-button:hover {
            background: ${selectedExpandCollapseHoverBehavior};
        }

        ::slotted(${context.tagFor(TreeItem)}) {
            --tree-item-nested-width: 1em;
            --expand-collapse-button-nested-width: calc(${heightNumber} * -1px);
        }
  `.withBehaviors(
        new DirectionalStyleSheetBehavior(ltr, rtl),
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    forced-color-adjust: none;
                    border-color: transparent;
                    background: ${SystemColors.ButtonFace};
                    color: ${SystemColors.ButtonText};
                }

                .positioning-region {
                    background: ${SystemColors.ButtonFace};
                }

                :host(:not([disabled])) .positioning-region:hover,
                :host(:not([disabled])[selected]) .positioning-region {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.Highlight};
                    color: ${SystemColors.HighlightText};
                }

                :host(:${focusVisible}) .positioning-region {
                    background: ${SystemColors.ButtonFace};
                    border-color: currentcolor;
                    box-shadow: 0 0 0 2px inset ${SystemColors.ButtonFace};
                    color: ${SystemColors.ButtonText};
                }

                :host([disabled]) {
                    opacity: 1;
                }

                :host([disabled]) .positioning-region {
                    color: ${SystemColors.GrayText};
                    fill: currentcolor;
                }

                :host([disabled]:${focusVisible}) .positioning-region {
                    box-shadow: none;
                    background: ${SystemColors.ButtonFace};
                    color:  ${SystemColors.GrayText};
                }

                :host(.nested) .expand-collapse-button:hover,
                :host(:not([disabled])[selected]) .expand-collapse-button:hover {
                    background: ${SystemColors.ButtonFace};
                    fill: ${SystemColors.ButtonText};
                }
            `
        )
    );
