import { applyFontSize, padding } from "../utilities/density";
import { fontWeight } from "../utilities/fonts";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { applyCornerRadius, applyDisabledState, DesignSystem } from "../design-system";
import { toPx } from "@microsoft/fast-jss-utilities";
import {
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralFocus,
    neutralForegroundHint,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";

/**
 * Shared input field styles
 */
export function inputFieldStyles(designSystem: DesignSystem): CSSRules<{}> {
    return {
        ...applyFontSize(designSystem),
        background: neutralFillInputRest,
        border: `${toPx(
            designSystem.outlinePatternOutlineWidth
        )} solid ${neutralOutlineRest(designSystem)}`,
        color: neutralForegroundRest,
        fontFamily: "inherit",
        fontWeight: fontWeight.normal.toString(),
        boxSizing: "border-box",
        ...applyCornerRadius(designSystem),
        padding: `0 ${padding(designSystem.outlinePatternOutlineWidth)(designSystem)}`,
        margin: "0",
        transition: "all 0.2s ease-in-out",
        "&:hover:enabled": {
            background: neutralFillInputHover,
            borderColor: neutralOutlineHover,
        },
        "&:active:enabled": {
            background: neutralFillInputActive,
            borderColor: neutralOutlineActive,
        },
        "&:focus": {
            boxShadow: `0 0 0 1px ${neutralFocus(designSystem)} inset`,
            borderColor: neutralFocus,
            outline: "none",
        },
        "&:disabled": {
            ...applyDisabledState(designSystem),
        },
        "&::placeholder": {
            color: neutralForegroundHint,
        },
    };
}
