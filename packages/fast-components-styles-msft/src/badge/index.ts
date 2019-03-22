import { BadgeClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import {
    ComponentStyles,
    ComponentStyleSheet,
    CSSRules,
} from "@microsoft/fast-jss-manager";
import { ellipsis, toPx } from "@microsoft/fast-jss-utilities";
import { DesignSystem, withDesignSystemDefaults } from "../design-system/index";
import { applyCornerRadius } from "../utilities/border";
import { accentForegroundCut, neutralForegroundRest } from "../utilities/color";
import { Swatch } from "../utilities/color/palette";
import { applyCursorDefault } from "../utilities/cursor";
import { horizontalSpacing } from "../utilities/density";
import { fontWeight } from "../utilities/fonts";
import { applyScaledTypeRamp } from "../utilities/typography";

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
    // Badges do not switch color on theme change
    const filledBackground: string = "#FFD800";
    const largeHeight: number =
        (designSystem.baseHeightMultiplier + designSystem.density - 2) *
        designSystem.designUnit;

    return {
        badge: {
            ...applyScaledTypeRamp(designSystem, "t7"),
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
            ...applyScaledTypeRamp(designSystem, "t8"),
            lineHeight: "13px",
            height: "16px",
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
                padding: `0 ${horizontalSpacing()(designSystem)}`,
            },
        },
    };
};

export default styles;
