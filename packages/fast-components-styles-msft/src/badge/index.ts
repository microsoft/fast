import { BadgeClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { ellipsis, format, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem, withDesignSystemDefaults } from "../design-system/index";
import { applyCornerRadius } from "../utilities/border";
import { accentForegroundCut, neutralForegroundRest } from "../utilities/color";
import { Swatch } from "../utilities/color/common";
import { applyCursorDefault } from "../utilities/cursor";
import { horizontalSpacing } from "../utilities/density";
import { applyScaledTypeRamp } from "../utilities/typography";
import { applyFontWeightNormal, applyFontWeightSemiBold } from "../utilities/fonts";

const styles: ComponentStyles<BadgeClassNameContract, DesignSystem> = (
    config: DesignSystem
): ComponentStyleSheet<BadgeClassNameContract, DesignSystem> => {
    const designSystem: DesignSystem = withDesignSystemDefaults(config);
    // Badges do not switch color on theme change
    const filledBackground: string = "#FFD800";
    const largeHeight: number =
        Math.max(designSystem.baseHeightMultiplier + designSystem.density - 2, 5) *
        designSystem.designUnit;
    const smallHeight: number =
        Math.max(designSystem.baseHeightMultiplier + designSystem.density - 3, 4) *
        designSystem.designUnit;

    return {
        badge: {
            ...applyScaledTypeRamp("t7"),
            ...applyFontWeightSemiBold(),
            ...ellipsis(),
            overflow: "hidden",
            ...applyCursorDefault(),
            boxSizing: "border-box",
            display: "inline-block",
            maxWidth: "215px",
            color: neutralForegroundRest,
            transition: "all 0.2s ease-in-out",
        },
        badge__filled: {
            ...applyCornerRadius(),
            ...applyFontWeightNormal(),
            backgroundColor: filledBackground,
            color: accentForegroundCut((): Swatch => filledBackground),
        },
        badge__small: {
            ...applyScaledTypeRamp("t8"),
            lineHeight: toPx(smallHeight - 3),
            height: toPx(smallHeight),
            "&$badge__filled": {
                padding: `1px ${toPx(
                    designSystem.designUnit *
                        (designSystem.baseHorizontalSpacingMultiplier - 1)
                )}`,
            },
        },
        badge__large: {
            height: toPx(largeHeight),
            lineHeight: toPx(largeHeight),
            "&$badge__filled": {
                padding: format("0 {0}", horizontalSpacing()),
            },
        },
    };
};

export default styles;
