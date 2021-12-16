import { css, ElementStyles } from "@microsoft/fast-element";
import {
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    controlCornerRadius,
    designUnit,
    fillColor,
    neutralForegroundRest,
    strokeWidth,
} from "../design-tokens.js";
import { elevationShadowFlyout } from "../styles/index.js";

/**
 * Styles for Picker menu
 * @public
 */
export const pickerMenuStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) =>
    css`
        :host {
            background: ${fillColor};
            border: calc(${strokeWidth} * 1px) solid transparent;
            box-shadow: ${elevationShadowFlyout};
            box-sizing: border-box;
            color: ${neutralForegroundRest};
            display: flex;
            fill: currentcolor;
            flex-direction: column;
            margin-top: calc(${designUnit} * 2px);
            max-height: 100%;
            min-height: 58px;
            overflow-y: auto;
            overflow-x: hidden;
            pointer-events: auto;
            border-radius: calc(${controlCornerRadius} * 1px);
            padding: calc(${designUnit} * 2px);
            width: 100%;
            /* TODO: a mechanism to manage z-index across components
            https://github.com/microsoft/fast/issues/3813 */
            z-index: 1000;
        }

        .suggestions-available-alert {
            height: 0;
            opacity: 0;
            overflow: hidden;
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    background: ${SystemColors.Canvas};
                    border-color: ${SystemColors.CanvasText};
                }
            `
        )
    );
