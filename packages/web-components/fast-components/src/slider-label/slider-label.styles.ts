import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    bodyFont,
    designUnit,
    disabledOpacity,
    neutralForegroundRest,
    neutralStrokeRest,
} from "../design-tokens.js";
import { heightNumber } from "../styles/index.js";

/**
 * Styles for Horizontal Slider label
 * @public
 */
export const horizontalSliderLabelStyles = css`
    :host {
        align-self: start;
        grid-row: 2;
        margin-top: -2px;
        height: calc((${heightNumber} / 2 + ${designUnit}) * 1px);
        width: auto;
    }
    .container {
        grid-template-rows: auto auto;
        grid-template-columns: 0;
    }
    .label {
        margin: 2px 0;
    }
`;

/**
 * Styles for Vertical slider label
 * @public
 */
export const verticalSliderLabelStyles = css`
    :host {
        justify-self: start;
        grid-column: 2;
        margin-left: 2px;
        height: auto;
        width: calc((${heightNumber} / 2 + ${designUnit}) * 1px);
    }
    .container {
        grid-template-columns: auto auto;
        grid-template-rows: 0;
        min-width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
    }
    .mark {
        transform: rotate(90deg);
        align-self: center;
    }
    .label {
        margin-left: calc((${designUnit} / 2) * 3px);
        align-self: center;
    }
`;

/**
 * Styles for Slider Label
 * @public
 */
export const sliderLabelStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) =>
    css`
        ${display("block")} :host {
            font-family: ${bodyFont};
            color: ${neutralForegroundRest};
            fill: currentcolor;
        }
        .root {
            position: absolute;
            display: grid;
        }
        .container {
            display: grid;
            justify-self: center;
        }
        .label {
            justify-self: center;
            align-self: center;
            white-space: nowrap;
            max-width: 30px;
        }
        .mark {
            width: calc((${designUnit} / 4) * 1px);
            height: calc(${heightNumber} * 0.25 * 1px);
            background: ${neutralStrokeRest};
            justify-self: center;
        }
        :host(.disabled) {
            opacity: ${disabledOpacity};
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                .mark {
                    forced-color-adjust: none;
                    background: ${SystemColors.FieldText};
                }
                :host(.disabled) {
                    forced-color-adjust: none;
                    opacity: 1;
                }
                :host(.disabled) .label {
                    color: ${SystemColors.GrayText};
                }
                :host(.disabled) .mark {
                    background: ${SystemColors.GrayText};
                }
            `
        )
    );
