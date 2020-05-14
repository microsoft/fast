import { fastDesignSystemDefaults } from "../fast-design-system";
import { neutralDividerRest } from "./neutral-divider";

describe("neutralDividerRest", (): void => {
    test("should return a string when invoked with an object", (): void => {
        expect(typeof neutralDividerRest(fastDesignSystemDefaults)).toBe("string");
    });

    test("should return a function when invoked with a function", (): void => {
        expect(typeof neutralDividerRest(() => "#FFF")).toBe("function");
    });
});
