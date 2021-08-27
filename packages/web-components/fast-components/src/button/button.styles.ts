import { css, ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    AccentButtonStyles,
    baseButtonStyles,
    LightweightButtonStyles,
    OutlineButtonStyles,
    StealthButtonStyles,
} from "../styles/";
import { appearanceBehavior } from "../utilities/behaviors";
import { disabledOpacity } from "../design-tokens";

const interactivitySelector: string = ":not([disabled])";

export const buttonStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        :host([disabled]) {
            opacity: ${disabledOpacity};
            cursor: ${disabledCursor};
        }

        ${baseButtonStyles(context, definition, interactivitySelector)}
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
