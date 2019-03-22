import { ButtonClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    applyFocusVisible,
    applyLocalizedProperty,
    Direction,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { height, horizontalSpacing } from "../utilities/density";
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    accentForegroundActive,
    accentForegroundCut,
    accentForegroundHover,
    accentForegroundRest,
    neutralFillActive,
    neutralFillHover,
    neutralFillRest,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralFocus,
    neutralForegroundRest,
    neutralOutlineActive,
    neutralOutlineHover,
    neutralOutlineRest,
} from "../utilities/color";
import { applyCursorPointer } from "../utilities/cursor";
import { applyCornerRadius, applyFocusPlaceholderBorder } from "../utilities/border";
import { applyDisabledState } from "../utilities/disabled";
import { applyScaledTypeRamp } from "../utilities/typography";

function applyTransparentBackplateStyles(
    designSystem: DesignSystem
): CSSRules<DesignSystem> {
    return {
        color: accentForegroundRest,
        fill: accentForegroundRest,
        ...applyTransparentBackground(),
        ...applyFocusVisible({
            borderColor: "transparent",
            boxShadow: "none",
            "& $button_contentRegion::before": {
                background: neutralForegroundRest,
            },
        }),
        // Underline
        "&:hover $button_contentRegion::before": {
            background: accentForegroundHover,
        },
        "&:active $button_contentRegion::before": {
            background: accentForegroundActive,
        },
        "&$button__disabled, &$button__disabled $button_contentRegion::before": {
            ...applyTransparentBackground(),
        },
        "&:hover:enabled": {
            color: accentForegroundHover,
            fill: accentForegroundHover,
            ...applyTransparentBackground(),
        },
        "&:active:enabled": {
            color: accentForegroundActive,
            fill: accentForegroundActive,
            ...applyTransparentBackground(),
        },
    };
}

function applyTransparentBackground(): CSSRules<DesignSystem> {
    return {
        backgroundColor: "transparent",
    };
}

const styles: ComponentStyles<ButtonClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<ButtonClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;

    return {
        button: {
            ...applyScaledTypeRamp("t7"),
            fontFamily: "inherit",
            ...applyCursorPointer(),
            boxSizing: "border-box",
            maxWidth: "374px",
            minWidth: designSystem.density <= -2 ? "100px" : "120px",
            padding: `0 ${horizontalSpacing(designSystem.focusOutlineWidth)(
                designSystem
            )}`,
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            height: height(),
            ...applyFocusPlaceholderBorder(designSystem),
            ...applyCornerRadius(),
            lineHeight: "1",
            overflow: "hidden",
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "all 0.1s ease-in-out",
            color: neutralForegroundRest,
            fill: neutralForegroundRest,
            background: neutralFillRest,
            "&:hover:enabled": {
                background: neutralFillHover,
            },
            "&:active:enabled": {
                background: neutralFillActive,
            },
            ...applyFocusVisible<DesignSystem>({
                borderColor: neutralFocus,
            }),
            "&::-moz-focus-inner": {
                border: "0",
            },
        },
        button__primary: {
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
            }),
            "& $button_beforeContent, & $button_afterContent": {
                fill: accentForegroundCut,
            },
        },
        button__outline: {
            background: neutralFillStealthRest,
            border: `${toPx(designSystem.outlineWidth)} solid ${neutralOutlineRest(
                designSystem
            )}`,
            padding: `0 ${horizontalSpacing(designSystem.outlineWidth)(designSystem)}`,
            "&:hover:enabled": {
                background: neutralFillStealthHover,
                border: `${toPx(designSystem.outlineWidth)} solid ${neutralOutlineHover(
                    designSystem
                )}`,
            },
            "&:active:enabled": {
                background: neutralFillStealthActive,
                border: `${toPx(designSystem.outlineWidth)} solid ${neutralOutlineActive(
                    designSystem
                )}`,
            },
            ...applyFocusVisible<DesignSystem>({
                boxShadow: `0 0 0 ${toPx(
                    designSystem.focusOutlineWidth - designSystem.outlineWidth
                )} ${neutralFocus(designSystem)} inset`,
                borderColor: neutralFocus,
            }),
        },
        button__lightweight: {
            ...applyTransparentBackplateStyles(designSystem),
        },
        button__justified: {
            ...applyTransparentBackplateStyles(designSystem),
            minWidth: "74px",
            paddingLeft: "0",
            paddingRight: "0",
            borderWidth: "0",
            justifyContent: "flex-start",
        },
        button_contentRegion: {
            position: "relative",
            "&::before": {
                content: "''",
                display: "block",
                height: toPx(designSystem.focusOutlineWidth),
                position: "absolute",
                bottom: "-3px",
                width: "100%",
                [applyLocalizedProperty("left", "right", direction)]: "0",
            },
        },
        button__disabled: {
            ...applyDisabledState(designSystem),
        },
        button_beforeContent: {},
        button_afterContent: {},
    };
};

export default styles;
