import { Direction, locLeft, locRight } from "./direction";

describe("locLeft:", (): void => {
    test("locMarginLeft should return 'left' when dir='ltr'", (): void => {
        expect(locLeft(Direction.ltr)).toBe("left")
    });
    test("locMarginLeft should return 'right' when dir='rtl'", (): void => {
        expect(locLeft(Direction.rtl)).toBe("right")
    });
});
