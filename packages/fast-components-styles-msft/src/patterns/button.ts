import { ButtonBaseClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles, CSSRules } from "@microsoft/fast-jss-manager";
import { directionSwitch, format, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem, DesignSystemResolver } from "../design-system";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import { applyCursorPointer } from "../utilities/cursor";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import {
    focusOutlineWidth,
    getDesignSystemValue,
    outlineWidth,
} from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";

const density: DesignSystemResolver<number> = getDesignSystemValue("density");

export function buttonStyles(): CSSRules<{}> {
    return {
        ...applyScaledTypeRamp("t7"),
        ...applyCursorPointer(),
        ...applyFocusPlaceholderBorder(),
        ...applyCornerRadius(),
        "font-family": "inherit",
        "box-sizing": "border-box",
        "max-width": "374px",
        "min-width": (designSystem: DesignSystem): string =>
            density(designSystem) <= -2 ? "28px" : "32px",
        padding: format("0 {0}", horizontalSpacing(focusOutlineWidth)),
        display: "inline-flex",
        "justify-content": "center",
        "align-items": "center",
        height: height(),
        "line-height": "1",
        overflow: "hidden",
        "text-decoration": "none",
        "white-space": "nowrap",
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
