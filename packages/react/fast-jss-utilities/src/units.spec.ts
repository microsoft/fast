import { toPx, toUnit } from "./units";

describe("toPx", () => {
    test("should convert a number to a pixel string", () => {
        expect(toPx(0)).toBe("0px");
    });
    test("should convert a number to a pixel string", () => {
        expect(toPx(10)).toBe("10px");
    });
    test("should convert the result of a function to a pixel value", () => {
        expect(toPx(() => 2)({})).toBe("2px");
    });
});

describe("toUnit", () => {
    test("should convert a number to pixels if no unit is provided", () => {
        expect(toUnit()(12)).toBe("12px");
    });
    test("should convert a number to pixels if an undefined value is provided", () => {
        let value: string;
        expect(toUnit(value)(12)).toBe("12px");
    });
    test("should append a custom defined unit", () => {
        expect(toUnit("deg")(18)).toBe("18deg");
    });
});
