import { AccentButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
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
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentForegroundCut,
    neutralFocus,
} from "../utilities/color";
import { isDarkMode, Palette, swatchByContrast } from "../utilities/color/palette";
import { applyCursorPointer } from "../utilities/cursor";
import { glyphSize, height, horizontalSpacing } from "../utilities/density";
import { accentPalette, focusOutlineWidth } from "../utilities/design-system";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";

const accentButtonInnerFocusRect: DesignSystemResolver<string> = swatchByContrast(
    neutralFocus
)(accentPalette)(
    (
        referenceColor: string,
        sourcePalette: Palette,
        designSystem: DesignSystem
    ): number => {
        return sourcePalette.indexOf(accentFillRest(designSystem));
    }
)(
    (referenceIndex: number, palette: string[], designSystem: DesignSystem): 1 | -1 => {
        return isDarkMode({
            ...designSystem,
            backgroundColor: neutralFocus(designSystem),
        })
            ? -1
            : 1;
    }
)((contrastRatio: number): boolean => contrastRatio >= 4.5);

const styles: ComponentStyles<AccentButtonClassNameContract, DesignSystem> = {
    button: {
        ...applyScaledTypeRamp("t7"),
        fontFamily: "inherit",
        ...applyCursorPointer(),
        boxSizing: "border-box",
        maxWidth: "374px",
        minWidth: ensureDesignSystemDefaults(
            (designSystem: DesignSystem): string =>
                designSystem.density <= -2 ? "100px" : "120px"
        ),
        padding: format("0 {0}", horizontalSpacing(focusOutlineWidth)),
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        height: height(),
        ...applyFocusPlaceholderBorder(),
        ...applyCornerRadius(),
        lineHeight: "1",
        overflow: "hidden",
        textDecoration: "none",
        whiteSpace: "nowrap",
        transition: "all 0.1s ease-in-out",
        "&::-moz-focus-inner": {
            border: "0",
        },
    },
    button__accent: {
        color: accentForegroundCut,
        fill: accentForegroundCut,
        background: accentFillRest,
        "&:hover:enabled": {
            background: accentFillHover,
        },
        "&:active:enabled": {
            background: accentFillActive,
        },
        ...applyFocusVisible<DesignSystem>({
            borderColor: neutralFocus,
            boxShadow: format("0 0 0 2px inset {0}", accentButtonInnerFocusRect),
        }),
        "& $button_beforeContent, & $button_afterContent": {
            fill: accentForegroundCut,
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
