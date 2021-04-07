import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import {
    AccentButtonStyles,
    BaseButtonStyles,
    HypertextStyles,
    LightweightButtonStyles,
    OutlineButtonStyles,
    StealthButtonStyles,
} from "../styles/patterns/button";
import { appearanceBehavior } from "../utilities/behaviors";

/**
 * Styles for the {@link FASTAnchor|FASTAnchor component}.
 *
 * @public
 */
export const AnchorStyles: ElementStyles = css`
    ${BaseButtonStyles}
`.withBehaviors(
    appearanceBehavior("accent", AccentButtonStyles),
    appearanceBehavior("hypertext", HypertextStyles),
    appearanceBehavior("lightweight", LightweightButtonStyles),
    appearanceBehavior("outline", OutlineButtonStyles),
    appearanceBehavior("stealth", StealthButtonStyles)
);
