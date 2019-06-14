import { CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem, ensureDesignSystemDefaults } from "../design-system";
import { format, toPx } from "@microsoft/fast-jss-utilities";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import { applyCursorPointer } from "../utilities/cursor";
import { focusOutlineWidth } from "../utilities/design-system";
import { applyScaledTypeRamp } from "../utilities/typography";
import { height, horizontalSpacing } from "../utilities/density";
import { outlineWidth } from "../utilities/design-system";

/**
 * Shared button styles
 */
export function buttonStyles(): CSSRules<{}> {
    return {
        ...applyScaledTypeRamp("t7"),
        ...applyCursorPointer(),
        ...applyFocusPlaceholderBorder(),
        ...applyCornerRadius(),
        fontFamily: "inherit",
        boxSizing: "border-box",
        maxWidth: "374px",
        minWidth: ensureDesignSystemDefaults(
            (designSystem: DesignSystem): string =>
                designSystem.density <= -2 ? "28px" : "32px"
        ),
        padding: format("0 {0}", horizontalSpacing(focusOutlineWidth)),
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        height: height(),
        lineHeight: "1",
        overflow: "hidden",
        textDecoration: "none",
        whiteSpace: "nowrap",
        transition: "all 0.1s ease-in-out",
        "&::-moz-focus-inner": {
            border: "0",
        },
    };
}
