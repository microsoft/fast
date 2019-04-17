import { DesignSystem, withDesignSystemDefaults } from "../design-system";
import {
    DensityCategory,
    getDensityCategory,
    getOffsetForDensityCategory,
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
        expect(height()({} as DesignSystem)).toBe("32px");
        expect(height(2)({} as DesignSystem)).toBe("64px");
        expect(height(2, "em")({} as DesignSystem)).toBe("64em");
        expect(getDensityCategory({} as DesignSystem)).toBe(DensityCategory.normal);
        expect(getOffsetForDensityCategory(-1, 1)({} as DesignSystem)).toBe(0);
        expect(getOffsetForDensityCategory(3, 2, 1)({} as DesignSystem)).toBe(1);
        expect(horizontalSpacing()({} as DesignSystem)).toBe("12px");
        expect(horizontalSpacing(2)({} as DesignSystem)).toBe("10px");
        expect(horizontalSpacing(2, "em")({} as DesignSystem)).toBe("10em");
        expect(glyphSize({} as DesignSystem)).toBe("16px");
        expect(glyphSize("em")({} as DesignSystem)).toBe("16em");
    });

    test("should operate on spacious design system", (): void => {
        expect(height()(spaciousDesignSystem)).toBe("55px");
        expect(height(2)(spaciousDesignSystem)).toBe("110px");
        expect(getDensityCategory(spaciousDesignSystem)).toBe(DensityCategory.spacious);
        expect(getOffsetForDensityCategory(-1, 1)(spaciousDesignSystem)).toBe(1);
        expect(getOffsetForDensityCategory(3, 2, 1)(spaciousDesignSystem)).toBe(2);
        expect(horizontalSpacing()(spaciousDesignSystem)).toBe("25px");
        expect(horizontalSpacing(2)(spaciousDesignSystem)).toBe("23px");
        expect(glyphSize(spaciousDesignSystem)).toBe("25px");
    });

    test("should operate on compact design system", (): void => {
        expect(height()(compactDesignSystem)).toBe("15px");
        expect(height(2)(compactDesignSystem)).toBe("30px");
        expect(getDensityCategory(compactDesignSystem)).toBe(DensityCategory.compact);
        expect(getOffsetForDensityCategory(-1, 1)(compactDesignSystem)).toBe(-1);
        expect(getOffsetForDensityCategory(3, 2, 1)(compactDesignSystem)).toBe(3);
        expect(horizontalSpacing()(compactDesignSystem)).toBe("3px");
        expect(horizontalSpacing(2)(compactDesignSystem)).toBe("1px");
        expect(glyphSize(compactDesignSystem)).toBe("9px");
    });
});
