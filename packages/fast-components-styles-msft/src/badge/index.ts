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
import { accentForegroundCut, neutralForegroundRest } from "../utilities/color";
import { DesignSystem, withDesignSystemDefaults } from "../design-system/index";
import { applyTypeRampConfig } from "../utilities/typography";
import { fontWeight } from "../utilities/fonts";

function smallBadgeStyle(): CSSRules<DesignSystem> {
    return {
        ...applyTypeRampConfig("t8"),
        padding: localizeSpacing(Direction.ltr)(`2px ${toPx(8)} 0 0`),
        height: "17px",
        "&$badge__filled": {
            padding: "1px 8px 2px",
        },
    };
}

function largeBadgeStyle(direction: Direction): CSSRules<DesignSystem> {
    return {
        [applyLocalizedProperty("paddingRight", "paddingLeft", direction)]: "12px",
        height: "20px",
        "&$badge__filled": {
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
    // Badges do not switch color on theme change
    const filledBackground: string = "#FFD800";

    return {
        badge: {
            ...applyTypeRampConfig("t7"),
            ...ellipsis(),
            overflow: "hidden",
            fontWeight: `${fontWeight.semibold}`,
            display: "inline-block",
            maxWidth: "215px",
            color: neutralForegroundRest,
            transition: "all 0.2s ease-in-out",
        },
        badge__filled: {
            ...backplateStyle(designSystem),
            backgroundColor: filledBackground,
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
