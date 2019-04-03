import {
    findClosestSwatchIndex,
    findSwatchIndex,
    getSwatch,
    palette,
    Palette,
    PaletteType,
    swatchByMode,
} from "./palette";
import designSystemDefaults, { DesignSystem } from "../../design-system";
import { accent } from "./color-constants";
import { Swatch } from "./common";

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
        expect(
            findSwatchIndex(PaletteType.neutral, "#FF0000")(designSystemDefaults)
        ).toBe(-1);
        expect(findSwatchIndex(PaletteType.accent, "#FF0000")(designSystemDefaults)).toBe(
            -1
        );
    });

    test("should find white", (): void => {
        expect(
            findSwatchIndex(PaletteType.neutral, "#FFFFFF")(designSystemDefaults)
        ).toBe(0);
        expect(findSwatchIndex(PaletteType.neutral, "#FFF")(designSystemDefaults)).toBe(
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
            findClosestSwatchIndex(PaletteType.neutral, "#008000")({} as DesignSystem)
        ).toBe(35);
        expect(
            findClosestSwatchIndex(PaletteType.neutral, "#F589FF")({} as DesignSystem)
        ).toBe(19);
    });
});

describe("getSwatch", (): void => {
    const colorPalette: Palette = ["#FFF", "#F00", "#000"];

    test("should return the first color when the input index is less than 0", (): void => {
        expect(getSwatch(-1, colorPalette)).toBe("#FFF");
    });

    test("should return the last color when the input index is greater than the last index of the palette", (): void => {
        expect(getSwatch(4, colorPalette)).toBe("#000");
    });

    test("should return the color at the provided index if the index is within the bounds of the array", (): void => {
        expect(getSwatch(0, colorPalette)).toBe("#FFF");
        expect(getSwatch(1, colorPalette)).toBe("#F00");
        expect(getSwatch(2, colorPalette)).toBe("#000");
    });
});

describe("swatchByMode", (): void => {
    test("should opperate on designSystemDefaults", (): void => {
        expect(swatchByMode(PaletteType.neutral)(0, 0)({} as DesignSystem)).toBe(
            designSystemDefaults.neutralPalette[0]
        );
        expect(swatchByMode(PaletteType.accent)(0, 0)({} as DesignSystem)).toBe(
            designSystemDefaults.accentPalette[0]
        );
    });
    test("should return the dark index color when the background color is dark", (): void => {
        expect(
            swatchByMode(PaletteType.neutral)(0, 7)({
                backgroundColor: "#000",
            } as DesignSystem)
        ).toBe(designSystemDefaults.neutralPalette[7]);
        expect(
            swatchByMode(PaletteType.accent)(0, 7)({
                backgroundColor: "#000",
            } as DesignSystem)
        ).toBe(designSystemDefaults.accentPalette[7]);
    });
});
