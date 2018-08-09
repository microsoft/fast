import { scaleContrast } from "./colors";

describe("scaleContrast", (): void => {
    test("should return zero if no argument is passed", (): void => {
        expect((scaleContrast as any)()).toBe(0);
    });

    test("should return the base factor if no scale factor is passed", (): void => {
        expect((scaleContrast as any)(3)).toBe(3);
    });

    test("should return 0 if the base factor is less than 0 and the scale factor is 0", (): void => {
        expect(scaleContrast(-1, 0)).toBe(0);
    });

    test("should return the base factor if scale is 0", (): void => {
        expect(scaleContrast(3, 0)).toBe(3);
    });

    test("should return the base factor if scale is less than 0", (): void => {
        expect(scaleContrast(3, -1)).toBe(3);
    });

    test("should return 21 if the base factor is 100", (): void => {
        expect(scaleContrast(3, 100)).toBe(21);
    });

    test("should return 21 if the base factor is greater than 100", (): void => {
        expect(scaleContrast(3, 101)).toBe(21);
    });

    test("should return 21 if the base ratio is 21 ", (): void => {
        expect(scaleContrast(21, 100)).toBe(21);
    });
});
