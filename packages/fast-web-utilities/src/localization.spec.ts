import isRTL from "./localization";

describe("Check to see if a locale is RTL", (): void => {
    test("should return false if locale is not valid", (): void => {
        expect(isRTL("")).toBe(false);
    });

    test("en", (): void => {
        expect(isRTL("en")).toBe(false);
    });
});
