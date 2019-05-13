import {
    applyLocalizedProperty,
    Direction,
    directionSwitch,
    localizeSpacing,
} from "./localization";

describe("localizeSpacing", (): void => {
    test("should return an empty string if no arguments are passed", (): void => {
        expect(localizeSpacing(Direction.ltr)(void 0)).toBe("");
    });
    test("should return the inital value when dir='ltr'", (): void => {
        const value: string = "top right bottom left";
        expect(localizeSpacing(Direction.ltr)(value)).toBe(value);
    });
    test("should invert index 1 and 3 when dir='rtl'", (): void => {
        expect(localizeSpacing(Direction.rtl)("top right bottom left")).toBe(
            "top left bottom right"
        );
    });
    test("should not localize a single argument", (): void => {
        expect(localizeSpacing(Direction.ltr)("all")).toBe(
            localizeSpacing(Direction.rtl)("all")
        );
    });
    test("should not localize two arguments", (): void => {
        expect(localizeSpacing(Direction.ltr)("top-bottom left-right")).toBe(
            localizeSpacing(Direction.rtl)("top-bottom left-right")
        );
    });
    test("should not localize three arguments", (): void => {
        expect(localizeSpacing(Direction.ltr)("top left-right bottom")).toBe(
            localizeSpacing(Direction.rtl)("top left-right bottom")
        );
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

describe("directionSwitch", (): void => {
    const ltrDesignSystem: { direction: Direction } = {
        direction: Direction.ltr,
    };
    const rtlDesignSystem: { direction: Direction } = {
        direction: Direction.rtl,
    };

    test("should return a function", (): void => {
        expect(typeof directionSwitch("ltr", "rtl")).toBe("function");
    });
    test("returned function should return the first argument when executed with a design-system that does not have a direction", (): void => {
        expect(directionSwitch("ltr", "rtl")({} as any)).toBe("ltr");
    });
    test("returned function should return the first argument when executed with a design-system that is ltr", (): void => {
        expect(directionSwitch("ltr", "rtl")(ltrDesignSystem)).toBe("ltr");
    });
    test("returned function should return the second argument when executed with a design-system that is rtl", (): void => {
        expect(directionSwitch("ltr", "rtl")(rtlDesignSystem)).toBe("rtl");
    });
    test("returned function should return the resolved first argument when executed with a design-system that is ltr", (): void => {
        const spy: jest.SpyInstance = jest.fn((): string => "resolvedLtr");

        expect(directionSwitch(spy as any, "rtl")(ltrDesignSystem)).toBe("resolvedLtr");
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(ltrDesignSystem);
    });
    test("returned function should return the second argument when executed with a design-system that is rtl", (): void => {
        const spy: jest.SpyInstance = jest.fn((): string => "resolvedRtl");

        expect(directionSwitch("ltr", spy as any)(rtlDesignSystem)).toBe("resolvedRtl");
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(rtlDesignSystem);
    });
});
