import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { BadgeClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { Direction, ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import { accentForegroundCut, neutralForegroundRest } from "../utilities/color";
import {
    applyCornerRadius,
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system/index";
import { fontWeight } from "../utilities/fonts";
import { applyFontSize, padding } from "../utilities/density";
import { Swatch } from "../utilities/color/palette";
import { applyCursorDefault } from "../utilities/cursor";

function smallBadgeStyle(designSystem: DesignSystem): CSSRules<DesignSystem> {
    return {
        ...applyFontSize(designSystem, -1),
        lineHeight: "13px",
        height: "16px",
        "&$badge__filled": {
            padding: `1px ${toPx(designSystem.designUnit * 2)}`,
        },
    };
}

function largeBadgeStyle(designSystem: DesignSystem): CSSRules<DesignSystem> {
    const height: number =
        (designSystem.defaultHeightMultiplier + designSystem.density - 2) *
        designSystem.designUnit;

    return {
        height: toPx(height),
        lineHeight: toPx(height),
        "&$badge__filled": {
            padding: `0 ${padding()(designSystem)}`,
        },
    };
}

function backplateStyle(designSystem: DesignSystem): CSSRules<DesignSystem> {
    return {
        ...applyCornerRadius(designSystem),
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
            ...applyFontSize(designSystem),
            ...ellipsis(),
            overflow: "hidden",
            ...applyCursorDefault(),
            boxSizing: "border-box",
            fontWeight: `${fontWeight.semibold}`,
            display: "inline-block",
            maxWidth: "215px",
            color: neutralForegroundRest,
            transition: "all 0.2s ease-in-out",
        },
        badge__filled: {
            ...backplateStyle(designSystem),
            backgroundColor: filledBackground,
            color: accentForegroundCut((): Swatch => filledBackground),
        },
        badge__small: {
            ...smallBadgeStyle(designSystem),
        },
        badge__large: {
            ...largeBadgeStyle(designSystem),
        },
    };
};

export default styles;
