import { css, ElementStyles } from "@microsoft/fast-element";
import {
    AccordionItemOptions,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    bodyFont,
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillActive,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens.js";
import { heightNumber } from "../styles/size.js";

/**
 * Styles for AccordionItem
 * @public
 */
export const accordionItemStyles: FoundationElementTemplate<
    ElementStyles,
    AccordionItemOptions
> = (context, definition) =>
    css`
        ${display("flex")} :host {
            box-sizing: border-box;
            font-family: ${bodyFont};
            flex-direction: column;
            font-size: ${typeRampBaseFontSize};
            line-height: ${typeRampBaseLineHeight};
            color: ${neutralForegroundRest};
            position: relative;
        }
        :host::after {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            content: "";
            background: ${neutralFillActive};
            width: calc(100% - 24px);
            height: 1px;
        }
        .region {
            display: none;
            padding: calc(${designUnit} * 4px) calc(${designUnit} * 5px);
        }
        :host > .heading {
            position: relative;
            display: grid;
            grid-template-columns: auto 1fr auto auto;
            align-items: center;
            z-index: 2;
            padding: calc(${designUnit} * 4px) calc(${designUnit} * 5px);
        }
        .button {
            appearance: none;
            border: none;
            background: none;
            grid-column: 2;
            grid-row: 1;
            outline: none;
            text-align: left;
            color: inherit;
            cursor: pointer;
            font-family: inherit;
            padding: 0;
        }
        .button::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            cursor: pointer;
        }
        .button:${focusVisible}::before {
            outline: none;
            border: calc(${strokeWidth} * 1px) solid ${focusStrokeOuter};
            border-radius: calc(${controlCornerRadius} * 1px);
            box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter};
        }
        :host(.expanded) .region {
            display: flex;
        }
        .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            grid-column: 4;
            z-index: 2;
            pointer-events: none;
            fill: currentcolor;
            margin-inline-start: calc(${designUnit} * 2px);
        }
        slot[name="collapsed-icon"] {
            display: flex;
        }
        :host(.expanded) slot[name="collapsed-icon"] {
            display: none;
        }
        slot[name="expanded-icon"] {
            display: none;
        }
        :host(.expanded) slot[name="expanded-icon"] {
            display: flex;
        }
        .start {
            display: flex;
            align-items: center;
            padding-inline-end: calc(${designUnit} * 2px);
            justify-content: center;
            grid-column: 1;
            z-index: 2;
        }
        .end {
            display: flex;
            align-items: center;
            padding-inline-start: calc(${designUnit} * 2px);
            justify-content: center;
            grid-column: 3;
            z-index: 2;
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                .button:${focusVisible}::before {
                    forced-color-adjust: none;
                    border-color: ${SystemColors.Highlight};
                    box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.Highlight};
                }
                slot[name="collapsed-icon"],
                slot[name="expanded-icon"] {
                    fill: ${SystemColors.ButtonText}
                }
            `
        )
    );
