import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { BadgeClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    applyLocalizedProperty,
    Direction,
    ellipsis,
    toPx,
} from "@microsoft/fast-jss-utilities";
import { DesignSystem, withDesignSystemDefaults } from "../design-system/index";
import { ensureNormalContrast } from "../utilities/colors";
import { fontWeight } from "../utilities/fonts";

function smallBadgeStyle(direction: Direction): CSSRules<DesignSystem> {
    return {
        padding: direction === Direction.ltr ? "0 7px 2px 0" : "0 0 2px 7px",
        height: "14px",
        lineHeight: "16px",
        "&$badge__highlight, &$badge__lowlight, &$badge__accent": {
            padding: "0 7px 4px",
        },
    };
}

function largeBadgeStyle(direction: Direction): CSSRules<DesignSystem> {
    return {
        [applyLocalizedProperty("paddingRight", "paddingLeft", direction)]: "14px",
        height: "20px",
        "&$badge__highlight, &$badge__lowlight, &$badge__accent": {
            padding: "2px 14px 4px",
        },
    };
}

function backplateStyle(designSystem: DesignSystem): CSSRules<DesignSystem> {
    return {
        borderRadius: toPx(designSystem.cornerRadius),
    };
}

const styles: ComponentStyles<BadgeClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<BadgeClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;
    const contrast: number = designSystem.contrast;
    // Badges do not switch color on theme change
    const foregroundColor: string = "#111";
    const backgroundColor: string = "#FFF";
    const lowlightBackground: string = "#333";
    const highlightBackground: string = "#FFD800";
    const accentBackground: string = designSystem.brandColor;
    const accentForegroundColor: string = ensureNormalContrast(
        contrast,
        foregroundColor,
        accentBackground
    );
    const hightlightForegroundColor: string = ensureNormalContrast(
        contrast,
        foregroundColor,
        highlightBackground
    );
    const lowlightForegroundColor: string = ensureNormalContrast(
        contrast,
        backgroundColor,
        lowlightBackground
    );

    return {
        badge: {
            fontSize: "13px",
            lineHeight: "20px",
            ...ellipsis(),
            overflow: "hidden",
            fontWeight: `${fontWeight.semibold}`,
            letterSpacing: "0.075em",
            display: "inline-block",
            maxWidth: "100%",
            color: designSystem.foregroundColor,
        },
        badge__highlight: {
            ...backplateStyle(designSystem),
            backgroundColor: highlightBackground,
            color: hightlightForegroundColor,
        },
        badge__lowlight: {
            ...backplateStyle(designSystem),
            backgroundColor: lowlightBackground,
            color: lowlightForegroundColor,
        },
        badge__accent: {
            ...backplateStyle(designSystem),
            backgroundColor: accentBackground,
            color: accentForegroundColor,
        },
        badge__small: {
            ...smallBadgeStyle(direction),
        },
        badge__large: {
            ...largeBadgeStyle(direction),
        },
    };
};

export default styles;
