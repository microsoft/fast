import {
    neutralForeground,
    neutralForegroundActive,
    neutralForegroundDark,
    neutralForegroundDeltaActive,
    neutralForegroundDeltaHover,
    neutralForegroundHover,
    neutralForegroundLight,
    neutralForegroundRest,
} from "./neutral-foreground";
import { palette, Palette, PaletteType, Swatch } from "./palette";
import designSystemDefaults from "../../design-system";

describe("neutralForeground", (): void => {
    test("should return a string when invoked with an object", (): void => {
        expect(typeof neutralForegroundRest(designSystemDefaults)).toBe("string");
        expect(typeof neutralForegroundHover(designSystemDefaults)).toBe("string");
        expect(typeof neutralForegroundActive(designSystemDefaults)).toBe("string");
    });

    test("should return a function when invoked with a function", (): void => {
        expect(typeof neutralForegroundRest(() => "#FFF")).toBe("function");
        expect(typeof neutralForegroundHover(() => "#FFF")).toBe("function");
        expect(typeof neutralForegroundActive(() => "#FFF")).toBe("function");
    });

    test("should operate on default design system if no design system is supplied", (): void => {
        const neutralPalette: Palette = palette(PaletteType.neutral)(
            designSystemDefaults
        );
        expect(neutralForegroundRest(undefined as any)).toBe(
            neutralForegroundDark(undefined)
        );
        expect(neutralForegroundRest(() => undefined as any)(undefined as any)).toBe(
            neutralForegroundDark(undefined)
        );
        // TODO: https://github.com/Microsoft/fast-dna/issues/1473
        // expect(neutralForegroundRest(() => "#FFF")(undefined as any)).toBe(
        //     neutralForegroundDark(undefined)
        // );
        expect(neutralForegroundRest(() => "#FFFFFF")(undefined as any)).toBe(
            neutralForegroundDark(undefined)
        );

        expect(neutralForegroundHover(undefined! as any)).toBe(
            neutralPalette[
                neutralPalette.indexOf(neutralForegroundDark(undefined)) -
                    neutralForegroundDeltaHover
            ]
        );
        expect(neutralForegroundHover(() => undefined as any)(undefined as any)).toBe(
            neutralPalette[
                neutralPalette.indexOf(neutralForegroundDark(undefined)) -
                    neutralForegroundDeltaHover
            ]
        );
        // TODO: https://github.com/Microsoft/fast-dna/issues/1473
        // expect(neutralForegroundHover(() => "#FFF")(undefined as any)).toBe(
        //     neutralPalette[
        //         neutralPalette.indexOf(neutralForegroundDark(undefined)) -
        //             neutralForegroundDeltaHover
        //     ]
        // );
        expect(neutralForegroundHover(() => "#FFFFFF")(undefined as any)).toBe(
            neutralPalette[
                neutralPalette.indexOf(neutralForegroundDark(undefined)) -
                    neutralForegroundDeltaHover
            ]
        );
        expect(neutralForegroundActive(undefined! as any)).toBe(
            neutralPalette[
                neutralPalette.indexOf(neutralForegroundDark(undefined)) -
                    neutralForegroundDeltaActive
            ]
        );
        expect(neutralForegroundActive(() => undefined as any)(undefined as any)).toBe(
            neutralPalette[
                neutralPalette.indexOf(neutralForegroundDark(undefined)) -
                    neutralForegroundDeltaActive
            ]
        );
        // TODO: https://github.com/Microsoft/fast-dna/issues/1473
        // expect(neutralForegroundActive(() => "#FFF")(undefined as any)).toBe(
        //     neutralPalette[
        //         neutralPalette.indexOf(neutralForegroundDark(undefined)) -
        //             neutralForegroundDeltaActive
        //     ]
        // );
        expect(neutralForegroundActive(() => "#FFFFFF")(undefined as any)).toBe(
            neutralPalette[
                neutralPalette.indexOf(neutralForegroundDark(undefined)) -
                    neutralForegroundDeltaActive
            ]
        );
    });

    test("should return #101010 with default design system values", (): void => {
        expect(neutralForegroundRest(designSystemDefaults)).toBe(
            neutralForegroundDark(undefined)
        );
    });

    test("should return #FFFFFF with a dark background", (): void => {
        expect(
            neutralForegroundRest(
                Object.assign({}, designSystemDefaults, {
                    backgroundColor: "#000",
                })
            )
        ).toBe("#FFFFFF");
    });
});
