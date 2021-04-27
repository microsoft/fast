import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    AccentButtonStyles,
    accentFillRestBehavior,
    BaseButtonStyles,
    LightweightButtonStyles,
    neutralFillRestBehavior,
    neutralFillStealthRestBehavior,
    OutlineButtonStyles,
    StealthButtonStyles,
} from "../styles/index";
import { appearanceBehavior } from "../utilities/behaviors";

export const ButtonStyles = css`
    :host([disabled]) {
        opacity: var(--disabled-opacity);
        background-color: ${neutralFillRestBehavior.var};
        cursor: ${disabledCursor};
    }

    ${BaseButtonStyles}
`.withBehaviors(
    forcedColorsStylesheetBehavior(
        css`
            :host([disabled]),
            :host([disabled]) .control {
                forced-color-adjust: none;
                background-color: ${SystemColors.ButtonFace};
                border-color: ${SystemColors.GrayText};
                color: ${SystemColors.GrayText};
                cursor: ${disabledCursor};
                opacity: 1;
            }
        `
    ),
    appearanceBehavior(
        "accent",
        css`
            :host([appearance="accent"][disabled]) {
                background: ${accentFillRestBehavior.var};
            }

            ${AccentButtonStyles}
        `.withBehaviors(
            forcedColorsStylesheetBehavior(
                css`
                    :host([appearance="accent"][disabled]) .control,
                    :host([appearance="accent"][disabled]) .control:hover {
                        background: ${SystemColors.ButtonFace};
                        border-color: ${SystemColors.GrayText};
                        color: ${SystemColors.GrayText};
                    }
                `
            )
        )
    ),
    appearanceBehavior(
        "lightweight",
        css`
            :host([appearance="lightweight"][disabled]) .content::before {
                background: transparent;
            }

            ${LightweightButtonStyles}
        `.withBehaviors(
            forcedColorsStylesheetBehavior(
                css`
                    :host([appearance="lightweight"].disabled) .control {
                        forced-color-adjust: none;
                        color: ${SystemColors.GrayText};
                    }

                    :host([appearance="lightweight"].disabled)
                        .control:hover
                        .content::before {
                        background: none;
                    }
                `
            )
        )
    ),
    appearanceBehavior(
        "outline",
        css`
            :host([appearance="outline"][disabled]) {
                border-color: ${accentFillRestBehavior.var};
            }

            ${OutlineButtonStyles}
        `.withBehaviors(
            forcedColorsStylesheetBehavior(
                css`
                    :host([appearance="outline"][disabled]) .control {
                        border-color: ${SystemColors.GrayText};
                    }
                `
            )
        )
    ),
    appearanceBehavior(
        "stealth",
        css`
            :host([appearance="stealth"][disabled]) {
                background: ${neutralFillStealthRestBehavior.var};
            }

            ${StealthButtonStyles}
        `.withBehaviors(
            forcedColorsStylesheetBehavior(
                css`
                    :host([appearance="stealth"].disabled) {
                        background: ${SystemColors.ButtonFace};
                    }

                    :host([appearance="stealth"].disabled) .control {
                        background: ${SystemColors.ButtonFace};
                        border-color: transparent;
                        color: ${SystemColors.GrayText};
                    }
                `
            )
        )
    )
);
