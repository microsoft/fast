import { applyTypeRampConfig } from "../utilities/typography";
import { fontWeight } from "../utilities/fonts";
import outlinePattern from "../patterns/outline";
import typographyPattern from "../patterns/typography";
import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { applyFocusVisible, toPx } from "@microsoft/fast-jss-utilities";
import { foregroundNormal } from "../utilities/colors";

/**
 * Shared input field styles
 */
export function inputFieldStyles(designSystem: DesignSystem): CSSRules<{}> {
    return {
        ...applyTypeRampConfig("t7"),
        ...outlinePattern.rest,
        ...typographyPattern.rest,
        fontFamily: "inherit",
        fontWeight: fontWeight.normal.toString(),
        boxSizing: "border-box",
        borderRadius: toPx(designSystem.cornerRadius),
        padding: "10px",
        margin: "0",
        "&:hover": {
            ...outlinePattern.hover,
        },
        ...applyFocusVisible({
            ...outlinePattern.focus,
        }),
        "&:disabled": {
            ...outlinePattern.disabled,
            ...typographyPattern.disabled,
            cursor: "not-allowed",
            "&::placeholder": {
                ...typographyPattern.disabled,
            },
        },
        "&::placeholder": {
            color: foregroundNormal,
        },
    };
}
