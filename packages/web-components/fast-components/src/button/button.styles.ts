import { css, ElementStyles } from "@microsoft/fast-element";
import {
    ButtonOptions,
    disabledCursor,
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    AccentButtonStyles,
    BaseButtonStyles,
    LightweightButtonStyles,
    OutlineButtonStyles,
    StealthButtonStyles,
} from "../styles/";
import { appearanceBehavior } from "../utilities/behaviors";
import { disabledOpacity } from "../design-tokens";

const interactivitySelector: string = ":not([disabled])";

/**
 * Styles for Button
 * @public
 */
export const buttonStyles: (
    context: ElementDefinitionContext,
    definition: ButtonOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: ButtonOptions) =>
    css`
        :host([disabled]) {
            opacity: ${disabledOpacity};
            cursor: ${disabledCursor};
        }
        ${BaseButtonStyles(context, definition, interactivitySelector)}
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host([disabled]),
                :host([disabled]) .control {
                    opacity: 1;
                    background: ${SystemColors.ButtonFace};
                    border-color: ${SystemColors.GrayText} !important;
                    box-shadow: none !important;
                    color: ${SystemColors.GrayText};
                    fill: currentcolor;
                }
            `
        ),
        appearanceBehavior(
            "accent",
            AccentButtonStyles(context, definition, interactivitySelector)
        ),
        appearanceBehavior(
            "lightweight",
            css`
                ${LightweightButtonStyles(context, definition, interactivitySelector)}
            `.withBehaviors(
                forcedColorsStylesheetBehavior(
                    css`
                        :host([disabled]),
                        :host([disabled]) .control {
                            border-color: ${SystemColors.ButtonFace} !important;
                        }
                    `
                )
            )
        ),
        appearanceBehavior(
            "outline",
            OutlineButtonStyles(context, definition, interactivitySelector)
        ),
        appearanceBehavior(
            "stealth",
            css`
                ${StealthButtonStyles(context, definition, interactivitySelector)}
            `.withBehaviors(
                forcedColorsStylesheetBehavior(
                    css`
                        :host([disabled]),
                        :host([disabled]) .control {
                            border-color: ${SystemColors.ButtonFace} !important;
                        }
                    `
                )
            )
        )
    );
