import isRTL from "./localization";

describe("Check to see if a locale is RTL", (): void => {
    test("en", (): void => {
        expect(isRTL("en")).toBe(false);
    });
    test("en-rtl", (): void => {
        expect(isRTL("en-rtl")).toBe(true);
    });
});
