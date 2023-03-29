import { css, ElementStyles } from "@microsoft/fast-element";
import { PropertyStyleSheetBehavior } from "@microsoft/fast-foundation";
import {
    AccentButtonStyles,
    BaseButtonStyles,
    HypertextStyles,
    LightweightButtonStyles,
    OutlineButtonStyles,
    StealthButtonStyles,
} from "./buttonstyles.js";

export function appearanceBehavior(value: string, styles: ElementStyles) {
    return new PropertyStyleSheetBehavior("appearance", value, styles);
}
/**
 * Styles for Anchor
 * @public
 */
export const anchorStyles = css`
    ${BaseButtonStyles}
`.withBehaviors(
    appearanceBehavior("accent", AccentButtonStyles),
    appearanceBehavior("hypertext", HypertextStyles),
    appearanceBehavior("lightweight", LightweightButtonStyles),
    appearanceBehavior("outline", OutlineButtonStyles),
    appearanceBehavior("stealth", StealthButtonStyles)
);
