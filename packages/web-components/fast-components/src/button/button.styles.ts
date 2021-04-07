import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import {
    AccentButtonStyles,
    BaseButtonStyles,
    LightweightButtonStyles,
    OutlineButtonStyles,
    StealthButtonStyles,
} from "../styles/index";
import { appearanceBehavior } from "../utilities/behaviors";

/**
 * Styles for the {@link FASTButton|FASTButton component}.
 *
 * @public
 */
export const ButtonStyles: ElementStyles = css`
    ${BaseButtonStyles}
`.withBehaviors(
    appearanceBehavior("accent", AccentButtonStyles),
    appearanceBehavior("lightweight", LightweightButtonStyles),
    appearanceBehavior("outline", OutlineButtonStyles),
    appearanceBehavior("stealth", StealthButtonStyles)
);
