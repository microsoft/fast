import { ButtonBaseClassNameContract as AccentButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    applyFocusVisible,
    directionSwitch,
    format,
    toPx,
} from "@microsoft/fast-jss-utilities";
import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
} from "../design-system";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import {
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFocus,
    neutralForegroundRest,
} from "../utilities/color";
import { applyCursorPointer } from "../utilities/cursor";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import { focusOutlineWidth } from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";

const styles: ComponentStyles<AccentButtonClassNameContract, DesignSystem> = {
    button: {
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
        color: neutralForegroundRest,
        fill: neutralForegroundRest,
        background: neutralFillStealthRest,
        "&:hover:enabled": {
            backgroundColor: neutralFillStealthHover,
        },
        "&:active:enabled": {
            backgroundColor: neutralFillStealthActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
        }),
        "&::-moz-focus-inner": {
            border: "0",
        },
    },
    button_contentRegion: {
        position: "relative",
        "&::before": {
            content: "''",
            display: "block",
            height: toPx<DesignSystem>(focusOutlineWidth),
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

export default styles;
