import { horizontalSpacing } from "../utilities/density";
import { fontWeight } from "../utilities/fonts";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
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
import { applyCornerRadius } from "../utilities/border";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";

/**
 * Shared input field styles
 */
export function inputFieldStyles(designSystem: DesignSystem): CSSRules<{}> {
    return {
        ...applyScaledTypeRamp("t7"),
        background: neutralFillInputRest,
        border: `${toPx(designSystem.outlineWidth)} solid ${neutralOutlineRest(
            designSystem
        )}`,
        color: neutralForegroundRest,
        fontFamily: "inherit",
        fontWeight: fontWeight.normal.toString(),
        boxSizing: "border-box",
        ...applyCornerRadius(designSystem),
        padding: `0 ${horizontalSpacing(designSystem.outlineWidth)(designSystem)}`,
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
