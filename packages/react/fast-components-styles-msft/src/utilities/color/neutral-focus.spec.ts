import designSystemDefaults, { DesignSystem } from "../../design-system";
import { neutralFocus } from "./neutral-focus";
import { contrast } from "./common";

describe("neutralFocus", (): void => {
    test("should return a string when invoked with an object", (): void => {
        expect(typeof neutralFocus(designSystemDefaults)).toBe("string");
    });

    test("should return a function when invoked with a function", (): void => {
        expect(typeof neutralFocus(() => "#FFF")).toBe("function");
    });

    test("should operate on default design system if no design system is supplied", (): void => {
        expect(contrast(neutralFocus({} as DesignSystem), "#FFF")).toBeGreaterThanOrEqual(
            3.5
        );
    });
});
