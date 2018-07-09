import { convertHexToRgb } from "./color";

describe("convertHexToRgb", (): void => {
    test("should throw an error when undefined value is passed", (): void => {
        expect((): any => convertHexToRgb(undefined)).toThrowError("Received hex value is not valid");
    });

    test("should throw an error when an invalid hex color is passed", (): void => {
        expect((): any => convertHexToRgb("#Z00000")).toThrowError("Received hex value is not valid");
    });

    test("should sucessfully handle hex values starting with a '#'", (): void => {
        expect(convertHexToRgb("#FFFFFF")).toBe("rgb(255, 255, 255)");
    });

    test("should sucessfully handle hex values without a '#'", (): void => {
        expect(convertHexToRgb("000000")).toBe("rgb(0, 0, 0)");
    });

    test("should sucessfully handle 3 digit hex values starting with a '#'", (): void => {
        expect(convertHexToRgb("#FF0")).toBe("rgb(255, 255, 0)");
    });

    test("should sucessfully handle 3 digit hex values without a '#'", (): void => {
        expect(convertHexToRgb("FF0")).toBe("rgb(255, 255, 0)");
    });

    test("should sucessfully return rgba values when alpha is passed", (): void => {
        expect(convertHexToRgb("#FF0", .9)).toBe("rgba(255, 255, 0, 0.9)");
    });
});
