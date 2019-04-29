import { toPx } from "@microsoft/fast-jss-utilities";
import defaultDesignSystem, {
    DesignSystem,
    withDesignSystemDefaults,
} from "../design-system";
import {
    DensityCategory,
    densityCategorySwitch,
    getDensityCategory,
    glyphSize,
    height,
    horizontalSpacing,
} from "./density";

describe("density", (): void => {
    const spaciousDesignSystem: DesignSystem = withDesignSystemDefaults({
        density: 2,
        designUnit: 5,
        baseHeightMultiplier: 9,
        baseHorizontalSpacingMultiplier: 4,
    });

    const compactDesignSystem: DesignSystem = withDesignSystemDefaults({
        density: -2,
        designUnit: 3,
        baseHeightMultiplier: 7,
        baseHorizontalSpacingMultiplier: 2,
    });

    test("should operate on design system defaults", (): void => {
        expect(height()({} as DesignSystem)).toBe(
            toPx(
                (defaultDesignSystem.baseHeightMultiplier + defaultDesignSystem.density) *
                    defaultDesignSystem.designUnit *
                    1
            )
        );
        expect(height(2)({} as DesignSystem)).toBe(
            toPx(
                (defaultDesignSystem.baseHeightMultiplier + defaultDesignSystem.density) *
                    defaultDesignSystem.designUnit *
                    2
            )
        );
        expect(height(2, "em")({} as DesignSystem)).toBe(
            `${(defaultDesignSystem.baseHeightMultiplier + defaultDesignSystem.density) *
                defaultDesignSystem.designUnit *
                2}em`
        );
        expect(getDensityCategory({} as DesignSystem)).toBe(DensityCategory.normal);
        expect(densityCategorySwitch(-1, 0, 1)({} as DesignSystem)).toBe(0);
        expect(densityCategorySwitch(3, 2, 1)({} as DesignSystem)).toBe(2);
        expect(horizontalSpacing()({} as DesignSystem)).toBe(
            toPx(
                (defaultDesignSystem.baseHorizontalSpacingMultiplier + 0) *
                    defaultDesignSystem.designUnit -
                    0
            )
        );
        expect(horizontalSpacing(2)({} as DesignSystem)).toBe(
            toPx(
                (defaultDesignSystem.baseHorizontalSpacingMultiplier + 0) *
                    defaultDesignSystem.designUnit -
                    2
            )
        );
        expect(horizontalSpacing(2, "em")({} as DesignSystem)).toBe(
            `${(defaultDesignSystem.baseHorizontalSpacingMultiplier + 0) *
                defaultDesignSystem.designUnit -
                2}em`
        );
        expect(glyphSize({} as DesignSystem)).toBe(
            toPx(
                (defaultDesignSystem.baseHeightMultiplier / 2) *
                    defaultDesignSystem.designUnit +
                    0
            )
        );
        expect(glyphSize("em")({} as DesignSystem)).toBe(
            `${(defaultDesignSystem.baseHeightMultiplier / 2) *
                defaultDesignSystem.designUnit +
                0}em`
        );
    });

    test("should operate on spacious design system", (): void => {
        expect(height()(spaciousDesignSystem)).toBe(
            toPx(
                (spaciousDesignSystem.baseHeightMultiplier +
                    spaciousDesignSystem.density) *
                    spaciousDesignSystem.designUnit *
                    1
            )
        );
        expect(height(2)(spaciousDesignSystem)).toBe(
            toPx(
                (spaciousDesignSystem.baseHeightMultiplier +
                    spaciousDesignSystem.density) *
                    spaciousDesignSystem.designUnit *
                    2
            )
        );
        expect(getDensityCategory(spaciousDesignSystem)).toBe(DensityCategory.spacious);
        expect(densityCategorySwitch(-1, 0, 1)(spaciousDesignSystem)).toBe(1);
        expect(densityCategorySwitch(3, 2, 1)(spaciousDesignSystem)).toBe(1);
        expect(horizontalSpacing()(spaciousDesignSystem)).toBe(
            toPx(
                (spaciousDesignSystem.baseHorizontalSpacingMultiplier + 1) *
                    spaciousDesignSystem.designUnit -
                    0
            )
        );
        expect(horizontalSpacing(2)(spaciousDesignSystem)).toBe(
            toPx(
                (spaciousDesignSystem.baseHorizontalSpacingMultiplier + 1) *
                    spaciousDesignSystem.designUnit -
                    2
            )
        );
        expect(glyphSize(spaciousDesignSystem)).toBe(
            toPx(
                (spaciousDesignSystem.baseHeightMultiplier / 2) *
                    spaciousDesignSystem.designUnit +
                    spaciousDesignSystem.designUnit / 2
            )
        );
    });

    test("should operate on compact design system", (): void => {
        expect(height()(compactDesignSystem)).toBe(
            toPx(
                (compactDesignSystem.baseHeightMultiplier + compactDesignSystem.density) *
                    compactDesignSystem.designUnit *
                    1
            )
        );
        expect(height(2)(compactDesignSystem)).toBe(
            toPx(
                (compactDesignSystem.baseHeightMultiplier + compactDesignSystem.density) *
                    compactDesignSystem.designUnit *
                    2
            )
        );
        expect(getDensityCategory(compactDesignSystem)).toBe(DensityCategory.compact);
        expect(densityCategorySwitch(-1, 0, 1)(compactDesignSystem)).toBe(-1);
        expect(densityCategorySwitch(3, 2, 1)(compactDesignSystem)).toBe(3);
        expect(horizontalSpacing()(compactDesignSystem)).toBe(
            toPx(
                (compactDesignSystem.baseHorizontalSpacingMultiplier - 1) *
                    compactDesignSystem.designUnit -
                    0
            )
        );
        expect(horizontalSpacing(2)(compactDesignSystem)).toBe(
            toPx(
                (compactDesignSystem.baseHorizontalSpacingMultiplier - 1) *
                    compactDesignSystem.designUnit -
                    2
            )
        );
        expect(glyphSize(compactDesignSystem)).toBe(
            toPx(
                (compactDesignSystem.baseHeightMultiplier / 2) *
                    compactDesignSystem.designUnit -
                    compactDesignSystem.designUnit / 2
            )
        );
    });
});
