import {
    palette,
    Palettes,
    Palette,
    Swatch,
    findSwatchIndex,
    findClosestSwatchIndex,
} from "./palette";
import { designSystemDefaults, DesignSystem } from "./design-system";
import { accent } from "./color-constants";

describe("palette", (): void => {
    test("should return a function", (): void => {
        expect(typeof palette(Palettes.accent)).toBe("function");
        expect(typeof palette(Palettes.neutral)).toBe("function");
    });

    test("should return a function that returns a palette if the argument does not match a palette", (): void => {
        expect((palette as any)()()).toHaveLength(63);
    });

    test("should return a palette if no designSystem is provided", (): void => {
        expect(palette(Palettes.neutral)(undefined as any)).toHaveLength(63);
        expect(palette(Palettes.accent)(undefined as any)).toHaveLength(63);
    });

    test("should return upper-case hex values", (): void => {
        (palette(Palettes.neutral)(designSystemDefaults) as Palette).forEach(
            (swatch: Swatch) => {
                expect(swatch).toBe(swatch.toUpperCase());
            }
        );
        (palette(Palettes.accent)(designSystemDefaults) as Palette).forEach(
            (swatch: Swatch) => {
                expect(swatch).toBe(swatch.toUpperCase());
            }
        );
    });

    test("should return six-letter hex values", (): void => {
        (palette(Palettes.neutral)(designSystemDefaults) as Palette).forEach(
            (swatch: Swatch) => {
                expect(swatch.length).toBe(7);
                expect(swatch.charAt(0)).toBe("#");
            }
        );
        (palette(Palettes.accent)(designSystemDefaults) as Palette).forEach(
            (swatch: Swatch) => {
                expect(swatch.length).toBe(7);
                expect(swatch.charAt(0)).toBe("#");
            }
        );
    });
});

describe("findSwatchIndex", (): void => {
    test("should impelment design-system defaults", (): void => {
        expect(findSwatchIndex(Palettes.neutral, "#FFF")({} as DesignSystem)).toBe(0);
        expect(findSwatchIndex(Palettes.accent, accent)({} as DesignSystem)).toBe(31);
    });

    test("should return -1 if the color is not found", (): void => {
        expect(findSwatchIndex(Palettes.neutral, "red")(designSystemDefaults)).toBe(-1);
        expect(findSwatchIndex(Palettes.accent, "red")(designSystemDefaults)).toBe(-1);
    });

    test("should find white", (): void => {
        expect(findSwatchIndex(Palettes.neutral, "#FFFFFF")(designSystemDefaults)).toBe(
            0
        );
        expect(findSwatchIndex(Palettes.neutral, "#FFF")(designSystemDefaults)).toBe(0);
        expect(findSwatchIndex(Palettes.neutral, "white")(designSystemDefaults)).toBe(0);
        expect(
            findSwatchIndex(Palettes.neutral, "rgb(255, 255, 255)")(designSystemDefaults)
        ).toBe(0);
    });

    test("should find black", (): void => {
        expect(findSwatchIndex(Palettes.neutral, "#000000")(designSystemDefaults)).toBe(
            62
        );
        expect(findSwatchIndex(Palettes.neutral, "#000")(designSystemDefaults)).toBe(62);
        expect(findSwatchIndex(Palettes.neutral, "black")(designSystemDefaults)).toBe(62);
        expect(
            findSwatchIndex(Palettes.neutral, "rgb(0, 0, 0)")(designSystemDefaults)
        ).toBe(62);
    });

    test("should find accent", (): void => {
        expect(findSwatchIndex(Palettes.accent, accent)(designSystemDefaults)).toBe(31);
        expect(
            findSwatchIndex(Palettes.accent, "rgb(0, 120, 212)")(designSystemDefaults)
        ).toBe(31);
    });
});

describe("findClosestSwatchIndex", (): void => {
    test("should return 0 if the input swatch cannot be converted to a color", (): void => {
        expect(
            findClosestSwatchIndex(Palettes.neutral, "pewpewpew")({} as DesignSystem)
        ).toBe(0);
    });
    test("should opperate with designSystemDefaults", (): void => {
        expect(
            findClosestSwatchIndex(Palettes.neutral, "#FFFFFF")({} as DesignSystem)
        ).toBe(0);
        expect(
            findClosestSwatchIndex(Palettes.neutral, "#808080")({} as DesignSystem)
        ).toBe(31);
        expect(
            findClosestSwatchIndex(Palettes.neutral, "#000000")({} as DesignSystem)
        ).toBe(62);
    });
    test("should return the index with the closest luminance to the input swatch if the swatch is not in the palette", (): void => {
        expect(
            findClosestSwatchIndex(Palettes.neutral, "green")({} as DesignSystem)
        ).toBe(35);
        expect(
            findClosestSwatchIndex(Palettes.neutral, "#F589FF")({} as DesignSystem)
        ).toBe(19);
    });
});
