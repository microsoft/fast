import defaultDesignSystem from "../design-system";
import { importantValue } from "./important";
import { height } from "./density";

describe("important", (): void => {
    test("adds !important to a passed in css value", (): void => {
        const result: string = importantValue("10px")(defaultDesignSystem);
        expect(result).toEqual("10px !important");
    });

    test("adds !important to a design system function", (): void => {
        const result: string = importantValue(height())(defaultDesignSystem);
        expect(result).toEqual("32px !important");
    });
});
