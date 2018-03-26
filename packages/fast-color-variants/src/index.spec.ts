import { variants } from "./index";

const white = "#ffffff";

describe("variants", (): void => {
    test("should return 7 variants by default", (): void => {
        expect(variants(white).length).toBe(7);
    });
    test("should return a custom number of variants", (): void => {
        expect(expect(variants(white, { variants: 2 }).length).toBe(2));
    });
    test("should create variants from a hexidecimal color", (): void => {
        expect(variants(white)[3]).toBe(white);
    });
    test("should create variants from a rgb color", (): void => {
        expect(variants("rgb(255,255,255)")[3]).toBe(white);
    });
    test("should treat RGBA colors as colors with full opacity", (): void => {
        expect(variants("rgba(255,255,255, .5)")[3]).toBe(white);
    });
});