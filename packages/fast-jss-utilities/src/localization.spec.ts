import { locSpacing } from "./spacing";
import { Direction } from "./direction";

describe("locSpacing", (): void => {
    test("should return an empty string if no arguments are passed", (): void => {
        expect(locSpacing(Direction.ltr)(void 0)).toBe("");
    });
    test("should return the inital value when dir='ltr'", (): void => {
        const value: string = "top right bottom left";
        expect(locSpacing(Direction.ltr)(value)).toBe(value);
    });
    test("should invert index 1 and 3 when dir='rtl'", (): void => {
        expect(locSpacing(Direction.rtl)("top right bottom left")).toBe("top left bottom right");
    });
    test("should not localize a single argument", (): void => {
        expect(locSpacing(Direction.ltr)("all")).toBe(locSpacing(Direction.rtl)("all"));
    });
    test("should not localize two arguments", (): void => {
        expect(locSpacing(Direction.ltr)("top-bottom left-right")).toBe(locSpacing(Direction.rtl)("top-bottom left-right"));
    });
    test("should not localize three arguments", (): void => {
        expect(locSpacing(Direction.ltr)("top left-right bottom")).toBe(locSpacing(Direction.rtl)("top left-right bottom"));
    });
});
