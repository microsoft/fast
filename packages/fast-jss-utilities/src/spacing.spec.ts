import { locMarginRight, locMarginLeft, locPaddingLeft, locPaddingRight, locSpacing } from "./spacing";
import { Direction } from "./direction";

describe("margin:", (): void => {
    test("locMarginLeft should return 'margin-left' when dir='ltr'", (): void => {
        expect(locMarginLeft(Direction.ltr)).toBe("margin-left")
    });
    test("locMarginLeft should return 'margin-right' when dir='rtl'", (): void => {
        expect(locMarginLeft(Direction.rtl)).toBe("margin-right")
    });
});

describe("padding:", (): void => {
    test("locPaddingLeft should return 'padding-left' when dir='ltr'", (): void => {
        expect(locMarginLeft(Direction.ltr)).toBe("margin-left")
    });
    test("locPaddingLeft should return 'padding-right' when dir='rtl'", (): void => {
        expect(locMarginLeft(Direction.rtl)).toBe("margin-right")
    });
});

describe("locSpacing", (): void => {
    test("should return arguments combine into a space-seperated string when dir='ltr'", (): void => {
        expect(locSpacing(Direction.ltr)("top", "right", "bottom", "left")).toBe("top right bottom left");
    });

    test("should return arguments combine into a space-seperated string with index 1 and 3 inverted when dir='ltr'", (): void => {
        expect(locSpacing(Direction.rtl)("top", "right", "bottom", "left")).toBe("top left bottom right");
    });
});
