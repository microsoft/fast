import { BadgeClassNameContract } from "@microsoft/fast-components-class-name-contracts-msft";
import { ComponentStyles } from "@microsoft/fast-jss-manager";
import {
    add,
    ellipsis,
    format,
    multiply,
    subtract,
    toPx,
} from "@microsoft/fast-jss-utilities";
import designSystemDefaults, {
    DesignSystem,
    DesignSystemResolver,
} from "../design-system/index";
import { applyCornerRadius } from "../utilities/border";
import { accentForegroundCut, neutralForegroundRest } from "../utilities/color";
import { Swatch } from "../utilities/color/common";
import { applyCursorDefault } from "../utilities/cursor";
import { horizontalSpacing } from "../utilities/density";
import { applyScaledTypeRamp } from "../utilities/typography";
import { applyFontWeightNormal, applyFontWeightSemiBold } from "../utilities/fonts";
import {
    baseHeightMultiplier,
    baseHorizontalSpacingMultiplier,
    designUnit,
} from "../utilities/design-system";

const filledBackground: string = "#FFD800";
const density: DesignSystemResolver<number> = (designSystem: DesignSystem): number =>
    designSystem && designSystem.hasOwnProperty("density")
        ? designSystem.density
        : designSystemDefaults.density;
const largeHeight: DesignSystemResolver<number> = (designSystem: DesignSystem): number =>
    Math.max(subtract(add(baseHeightMultiplier, density), 2)(designSystem), 5) *
    designUnit(designSystem);
const smallHeight: DesignSystemResolver<number> = (designSystem: DesignSystem): number =>
    Math.max(subtract(add(baseHeightMultiplier, density), 3)(designSystem), 4) *
    designUnit(designSystem);
const styles: ComponentStyles<BadgeClassNameContract, DesignSystem> = {
    badge: {
        ...applyScaledTypeRamp("t7"),
        ...applyFontWeightSemiBold(),
        ...ellipsis(),
        overflow: "hidden",
        ...applyCursorDefault(),
        "box-sizing": "border-box",
        display: "inline-block",
        "max-width": "215px",
        color: neutralForegroundRest,
        transition: "all 0.2s ease-in-out",
    },
    badge__filled: {
        ...applyCornerRadius(),
        ...applyFontWeightNormal(),
        "background-color": filledBackground,
        color: accentForegroundCut((): Swatch => filledBackground),
    },
    badge__small: {
        ...applyScaledTypeRamp("t8"),
        "line-height": toPx(subtract(smallHeight, 3)),
        height: toPx(smallHeight),
        "&$badge__filled": {
            padding: format(
                "1px {0}",
                toPx(multiply(designUnit, subtract(baseHorizontalSpacingMultiplier, 1)))
            ),
        },
    },
    badge__large: {
        height: toPx(largeHeight),
        "line-height": toPx(largeHeight),
        "&$badge__filled": {
            padding: format("0 {0}", horizontalSpacing()),
        },
    },
};

export default styles;
