import { css } from "@microsoft/fast-element";
import { disabledCursor } from "@microsoft/fast-foundation";
import {
    AccentButtonStyles,
    accentFillRestBehavior,
    BaseButtonStyles,
    LightweightButtonStyles,
    neutralFillRestBehavior,
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
    appearanceBehavior(
        "accent",
        css`
            :host([appearance="accent"][disabled]) {
                background: ${accentFillRestBehavior.var};
            }
            ${AccentButtonStyles}
        `
    ),
    appearanceBehavior("lightweight", LightweightButtonStyles),
    appearanceBehavior("outline", OutlineButtonStyles),
    appearanceBehavior("stealth", StealthButtonStyles)
);
