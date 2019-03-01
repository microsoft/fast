import {
    findClosestSwatchIndex,
    findSwatchIndex,
    getPaletteIndex,
    palette,
    Palette,
    PaletteType,
    Swatch,
} from "./palette";
import designSystemDefaults, { DesignSystem } from "../../design-system";
import { accent } from "./color-constants";

describe("palette", (): void => {
    test("should return a function", (): void => {
        expect(typeof palette(PaletteType.accent)).toBe("function");
        expect(typeof palette(PaletteType.neutral)).toBe("function");
    });

    test("should return a function that returns a palette if the argument does not match a palette", (): void => {
        expect((palette as any)()()).toHaveLength(63);
    });

    test("should return a palette if no designSystem is provided", (): void => {
        expect(palette(PaletteType.neutral)(undefined as any)).toHaveLength(63);
        expect(palette(PaletteType.accent)(undefined as any)).toHaveLength(63);
    });

    test("should return upper-case hex values", (): void => {
        (palette(PaletteType.neutral)(designSystemDefaults) as Palette).forEach(
            (swatch: Swatch) => {
                expect(swatch).toBe(swatch.toUpperCase());
            }
        );
        (palette(PaletteType.accent)(designSystemDefaults) as Palette).forEach(
            (swatch: Swatch) => {
                expect(swatch).toBe(swatch.toUpperCase());
            }
        );
    });

    test("should return six-letter hex values", (): void => {
        (palette(PaletteType.neutral)(designSystemDefaults) as Palette).forEach(
            (swatch: Swatch) => {
                expect(swatch.length).toBe(7);
                expect(swatch.charAt(0)).toBe("#");
            }
        );
        (palette(PaletteType.accent)(designSystemDefaults) as Palette).forEach(
            (swatch: Swatch) => {
                expect(swatch.length).toBe(7);
                expect(swatch.charAt(0)).toBe("#");
            }
        );
    });
});

describe("findSwatchIndex", (): void => {
    test("should impelment design-system defaults", (): void => {
        expect(findSwatchIndex(PaletteType.neutral, "#FFF")({} as DesignSystem)).toBe(0);
        expect(findSwatchIndex(PaletteType.accent, accent)({} as DesignSystem)).toBe(31);
    });

    test("should return -1 if the color is not found", (): void => {
        expect(findSwatchIndex(PaletteType.neutral, "red")(designSystemDefaults)).toBe(
            -1
        );
        expect(findSwatchIndex(PaletteType.accent, "red")(designSystemDefaults)).toBe(-1);
    });

    test("should find white", (): void => {
        expect(
            findSwatchIndex(PaletteType.neutral, "#FFFFFF")(designSystemDefaults)
        ).toBe(0);
        expect(findSwatchIndex(PaletteType.neutral, "#FFF")(designSystemDefaults)).toBe(
            0
        );
        expect(findSwatchIndex(PaletteType.neutral, "white")(designSystemDefaults)).toBe(
            0
        );
        expect(
            findSwatchIndex(PaletteType.neutral, "rgb(255, 255, 255)")(
                designSystemDefaults
            )
        ).toBe(0);
    });

    test("should find black", (): void => {
        expect(
            findSwatchIndex(PaletteType.neutral, "#000000")(designSystemDefaults)
        ).toBe(62);
        expect(findSwatchIndex(PaletteType.neutral, "#000")(designSystemDefaults)).toBe(
            62
        );
        expect(findSwatchIndex(PaletteType.neutral, "black")(designSystemDefaults)).toBe(
            62
        );
        expect(
            findSwatchIndex(PaletteType.neutral, "rgb(0, 0, 0)")(designSystemDefaults)
        ).toBe(62);
    });

    test("should find accent", (): void => {
        expect(findSwatchIndex(PaletteType.accent, accent)(designSystemDefaults)).toBe(
            31
        );
        expect(
            findSwatchIndex(PaletteType.accent, "rgb(0, 120, 212)")(designSystemDefaults)
        ).toBe(31);
    });
});

describe("findClosestSwatchIndex", (): void => {
    test("should return 0 if the input swatch cannot be converted to a color", (): void => {
        expect(
            findClosestSwatchIndex(PaletteType.neutral, "pewpewpew")({} as DesignSystem)
        ).toBe(0);
    });
    test("should opperate with designSystemDefaults", (): void => {
        expect(
            findClosestSwatchIndex(PaletteType.neutral, "#FFFFFF")({} as DesignSystem)
        ).toBe(0);
        expect(
            findClosestSwatchIndex(PaletteType.neutral, "#808080")({} as DesignSystem)
        ).toBe(31);
        expect(
            findClosestSwatchIndex(PaletteType.neutral, "#000000")({} as DesignSystem)
        ).toBe(62);
    });
    test("should return the index with the closest luminance to the input swatch if the swatch is not in the palette", (): void => {
        expect(
            findClosestSwatchIndex(PaletteType.neutral, "green")({} as DesignSystem)
        ).toBe(35);
        expect(
            findClosestSwatchIndex(PaletteType.neutral, "#F589FF")({} as DesignSystem)
        ).toBe(19);
    });
});

describe("getPaletteIndex", (): void => {
    const colorPalette: Palette = ["#FFF", "#F00", "#000"];

    test("should return the first color when the input index is less than 0", (): void => {
        expect(getPaletteIndex(-1, colorPalette)).toBe("#FFF");
    });

    test("should return the last color when the input index is greater than the last index of the palette", (): void => {
        expect(getPaletteIndex(4, colorPalette)).toBe("#000");
    });

    test("should return the color at the provided index if the index is within the bounds of the array", (): void => {
        expect(getPaletteIndex(0, colorPalette)).toBe("#FFF");
        expect(getPaletteIndex(1, colorPalette)).toBe("#F00");
        expect(getPaletteIndex(2, colorPalette)).toBe("#000");
    });
});
