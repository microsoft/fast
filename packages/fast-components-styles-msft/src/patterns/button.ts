import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { DesignSystem } from "../design-system";
import { directionSwitch, format, toPx } from "@microsoft/fast-jss-utilities";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import { applyCursorPointer } from "../utilities/cursor";
import { focusOutlineWidth, outlineWidth } from "../utilities/design-system";
import { applyScaledTypeRamp } from "../utilities/typography";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import { applyDisabledState } from "../utilities/disabled";
import { ButtonBaseClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { DesignSystemResolver, getDesignSystemValue, } from "../design-system"

const density: DesignSystemResolver<number> = getDesignSystemValue(
    "density"
);

export function buttonStyles(): CSSRules<{}> {
    return {
        ...applyScaledTypeRamp("t7"),
        ...applyCursorPointer(),
        ...applyFocusPlaceholderBorder(),
        ...applyCornerRadius(),
        fontFamily: "inherit",
        boxSizing: "border-box",
        maxWidth: "374px",
        minWidth:
            (designSystem: DesignSystem): string =>
                density(designSystem) <= -2 ? "28px" : "32px"
        ,
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
/**
 * The base button stye object
 */
export const baseButton: ComponentStyles<ButtonBaseClassNameContract, DesignSystem> = {
    button_contentRegion: {
        position: "relative",
        "&::before": {
            content: "''",
            display: "block",
            height: toPx<DesignSystem>(outlineWidth),
            position: "absolute",
            bottom: "-3px",
            width: "100%",
            left: directionSwitch("0", ""),
            right: directionSwitch("", "0"),
        },
        "& svg": {
            width: glyphSize,
            height: glyphSize,
        },
    },
    button__disabled: {
        ...applyDisabledState(),
    },
    button_beforeContent: {
        width: glyphSize,
        height: glyphSize,
    },
    button_afterContent: {
        width: glyphSize,
        height: glyphSize,
    },
};
