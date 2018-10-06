import { hexToRgb } from "./rgb";

describe("hexToRgb", (): void => {
    test("should return rgb(255, 255, 255)", (): void => {
        expect(hexToRgb("#FfF")).toBe("rgb(255, 255, 255)");
    });
    test("should return rgb(241, 242, 253)", (): void => {
        expect(hexToRgb("#f1f2fd")).toBe("rgb(241, 242, 253)");
    });
    test("should return rgba(255, 0, 0, 0.8)", (): void => {
        expect(hexToRgb("#F00c")).toBe("rgba(255, 0, 0, 0.8)");
    });
    test("should return rgba(255, 0, 0, 0.8)", (): void => {
        expect(hexToRgb("#FF0000CC")).toBe("rgba(255, 0, 0, 0.8)");
    });
    test("should return rgba(253, 224, 20, 0.5764705882352941)", (): void => {
        expect(hexToRgb("#Fde01493")).toBe("rgba(253, 224, 20, 0.5764705882352941)");
    });
    test("should return rgb(252, 233, 130)", (): void => {
        expect(hexToRgb("#fce982")).toBe("rgb(252, 233, 130)");
    });
});