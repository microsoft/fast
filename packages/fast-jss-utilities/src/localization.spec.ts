import { applyLocalizedProperty, Direction, localizeSpacing } from "./localization";

describe("localizeSpacing", (): void => {
    test("should return an empty string if no arguments are passed", (): void => {
        expect(localizeSpacing(Direction.ltr)(void 0)).toBe("");
    });
    test("should return the inital value when dir='ltr'", (): void => {
        const value: string = "top right bottom left";
        expect(localizeSpacing(Direction.ltr)(value)).toBe(value);
    });
    test("should invert index 1 and 3 when dir='rtl'", (): void => {
        expect(localizeSpacing(Direction.rtl)("top right bottom left")).toBe("top left bottom right");
    });
    test("should not localize a single argument", (): void => {
        expect(localizeSpacing(Direction.ltr)("all")).toBe(localizeSpacing(Direction.rtl)("all"));
    });
    test("should not localize two arguments", (): void => {
        expect(localizeSpacing(Direction.ltr)("top-bottom left-right")).toBe(localizeSpacing(Direction.rtl)("top-bottom left-right"));
    });
    test("should not localize three arguments", (): void => {
        expect(localizeSpacing(Direction.ltr)("top left-right bottom")).toBe(localizeSpacing(Direction.rtl)("top left-right bottom"));
    });
});

describe("applyLocalizedProperty", (): void => {
    test("should return the first argument when dir='ltr'", (): void => {
        expect(applyLocalizedProperty("left", "right", Direction.ltr)).toBe("left");
    });
    test("should return the second argument when dir='rtl'", (): void => {
        expect(applyLocalizedProperty("left", "right", Direction.rtl)).toBe("right");
    });
});
