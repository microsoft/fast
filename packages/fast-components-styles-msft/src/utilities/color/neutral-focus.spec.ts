import designSystemDefaults, { DesignSystem } from "../../design-system";
import { neutralFocus } from "./neutral-focus";

describe("neutralFocus", (): void => {
    test("should return a string when invoked with an object", (): void => {
        expect(typeof neutralFocus(designSystemDefaults)).toBe("string");
    });

    test("should return a function when invoked with a function", (): void => {
        expect(typeof neutralFocus(() => "#FFF")).toBe("function");
    });

    test("should operate on default design system if no design system is supplied", (): void => {
        expect(neutralFocus({} as DesignSystem)).toBe("#101010");
    });
});
