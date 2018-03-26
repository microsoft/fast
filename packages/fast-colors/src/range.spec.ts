import { range } from "./range";

const white = "#ffffff";

describe("range", (): void => {
    test("should return 7 range by default", (): void => {
        expect(range(white).length).toBe(7);
    });
    test("should return a custom number of range", (): void => {
        expect(expect(range(white, { variants: 2 }).length).toBe(2));
    });
    test("should create range from a hexidecimal color", (): void => {
        expect(range(white)[3]).toBe(white);
    });
    test("should create range from a rgb color", (): void => {
        expect(range("rgb(255,255,255)")[3]).toBe(white);
    });
    test("should treat RGBA colors as colors with full opacity", (): void => {
        expect(range("rgba(255,255,255, .5)")[3]).toBe(white);
    });
});