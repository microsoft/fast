import { applyTypeRampConfig } from "../utilities/typography";
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
import { density } from "../utilities/density";
import { fontWeight } from "../utilities/fonts";
import { defaultHeight, maxHeight, minHeight } from "../utilities/height";
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
        "&:active $button_contentRegion::before, &:hover $button_contentRegion::before": {
            background: accentForegroundHover,
        },
        "&$button__disabled, &$button__disabled $button_contentRegion::before": {
            ...applyTransparentBackground(),
        },
        "&:hover": {
            color: accentForegroundHover,
            ...applyTransparentBackground(),
        },
        "&:active": {
            color: accentForegroundActive,
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
            ...applyTypeRampConfig("t7"),
            fontFamily: "inherit",
            fontWeight: `${fontWeight.semibold}`,
            boxSizing: "border-box",
            maxWidth: "374px",
            minWidth: "120px",
            padding: "0 12px",
            display: "inline-flex",
            justifyContent: "center",
            alignItems: "center",
            height: density(defaultHeight)(designSystem),
            minHeight: toPx(minHeight),
            maxHeight: toPx(maxHeight),
            border: "2px solid",
            borderColor: "transparent",
            borderRadius: "2px",
            lineHeight: "1",
            overflow: "hidden",
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "all 0.1s ease-in-out",
            color: neutralForegroundRest,
            fill: neutralForegroundRest,
            background: neutralFillRest,
            "&:hover": {
                background: neutralFillHover,
            },
            "&:active": {
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
            "&:hover": {
                background: accentFillHover,
            },
            "&:active": {
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
            border: `1px solid ${neutralOutlineRest(designSystem)}`,
            "&:hover": {
                background: neutralFillStealthHover,
                border: `1px solid ${neutralOutlineHover(designSystem)}`,
            },
            "&:active": {
                background: neutralFillStealthActive,
                border: `1px solid ${neutralOutlineActive(designSystem)}`,
            },
            ...applyFocusVisible<DesignSystem>({
                boxShadow: `0 0 0 1px ${neutralFocus(designSystem)} inset`,
                borderColor: neutralFocus,
            }),
        },
        button__lightweight: {
            ...applyTransparentBackplateStyles(designSystem),
        },
        button__justified: {
            ...applyTransparentBackplateStyles(designSystem),
            minWidth: "74px",
            [applyLocalizedProperty("paddingLeft", "paddingRight", direction)]: "0",
            justifyContent: "flex-start",
        },
        button_contentRegion: {
            position: "relative",
            "&::before": {
                content: "''",
                display: "block",
                height: "2px",
                position: "absolute",
                bottom: "-3px",
                width: "100%",
                [applyLocalizedProperty("left", "right", direction)]: "0",
            },
        },
        button__disabled: {
            cursor: "not-allowed",
            opacity: "0.3",
        },
        button_beforeContent: {},
        button_afterContent: {},
    };
};

export default styles;
