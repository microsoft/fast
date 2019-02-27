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
    localizeSpacing,
    toPx,
} from "@microsoft/fast-jss-utilities";
import {
    accentFillRest,
    accentForegroundCut,
    neutralForegroundRest,
} from "../utilities/color";
import { DesignSystem, withDesignSystemDefaults } from "../design-system/index";
import { applyTypeRampConfig } from "../utilities/typography";
import { ensureNormalContrast } from "../utilities/colors";
import { fontWeight } from "../utilities/fonts";

function smallBadgeStyle(): CSSRules<DesignSystem> {
    return {
        ...applyTypeRampConfig("t8"),
        padding: localizeSpacing(Direction.ltr)(`2px ${toPx(8)} 0 0`),
        height: "17px",
        "&$badge__highlight, &$badge__lowlight, &$badge__accent": {
            padding: "1px 8px 2px",
        },
    };
}

function largeBadgeStyle(direction: Direction): CSSRules<DesignSystem> {
    return {
        [applyLocalizedProperty("paddingRight", "paddingLeft", direction)]: "12px",
        height: "20px",
        "&$badge__highlight, &$badge__lowlight, &$badge__accent": {
            padding: "3px 12px",
        },
    };
}

function backplateStyle(designSystem: DesignSystem): CSSRules<DesignSystem> {
    return {
        borderRadius: toPx(designSystem.cornerRadius),
        fontWeight: `${fontWeight.normal}`,
    };
}

const styles: ComponentStyles<BadgeClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<BadgeClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    const direction: Direction = designSystem.direction;
    const contrast: number = designSystem.contrast;
    // Badges do not switch color on theme change
    const backgroundColor: string = "#FFF";
    const lowlightBackground: string = "#333";
    const highlightBackground: string = "#FFD800";

    return {
        badge: {
            ...applyTypeRampConfig("t7"),
            ...ellipsis(),
            overflow: "hidden",
            fontWeight: `${fontWeight.semibold}`,
            display: "inline-block",
            maxWidth: "215px",
            color: neutralForegroundRest,
        },
        badge__highlight: {
            ...backplateStyle(designSystem),
            backgroundColor: highlightBackground,
            color: accentForegroundCut((): string => highlightBackground),
        },
        // TODO: No solution for this
        badge__lowlight: {
            ...backplateStyle(designSystem),
            backgroundColor: lowlightBackground,
            color: backgroundColor,
        },
        badge__accent: {
            ...backplateStyle(designSystem),
            backgroundColor: accentFillRest,
            color: accentForegroundCut,
        },
        badge__small: {
            ...smallBadgeStyle(),
        },
        badge__large: {
            ...largeBadgeStyle(direction),
        },
    };
};

export default styles;
