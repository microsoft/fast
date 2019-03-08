import { applyTypeRampConfig } from "../utilities/typography";
import { fontWeight } from "../utilities/fonts";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { applyFocusVisible, toPx } from "@microsoft/fast-jss-utilities";
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
        ...applyTypeRampConfig("t7"),
        background: neutralFillInputRest,
        border: `${toPx(
            designSystem.outlinePatternOutlineWidth
        )} solid ${neutralOutlineRest(designSystem)}`,
        color: neutralForegroundRest,
        fontFamily: "inherit",
        fontWeight: fontWeight.normal.toString(),
        boxSizing: "border-box",
        borderRadius: toPx(designSystem.cornerRadius),
        padding: "6px 12px",
        margin: "0",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
            background: neutralFillInputHover,
            border: `${toPx(
                designSystem.outlinePatternOutlineWidth
            )} solid ${neutralOutlineHover(designSystem)}`,
        },
        "&:active": {
            background: neutralFillInputActive,
            border: `${toPx(
                designSystem.outlinePatternOutlineWidth
            )} solid ${neutralOutlineActive(designSystem)}`,
        },
        "&:focus": {
            boxShadow: `0 0 0 1px ${neutralFocus(designSystem)} inset`,
            border: `${toPx(
                designSystem.outlinePatternOutlineWidth
            )} solid ${neutralFocus(designSystem)}`,
            outline: "none",
        },
        "&:disabled": {
            cursor: "not-allowed",
            opacity: "0.3",
        },
        "&::placeholder": {
            color: neutralForegroundHint,
        },
    };
}
