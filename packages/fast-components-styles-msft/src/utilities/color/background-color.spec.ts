import designSystemDefaults, { DesignSystem } from "../../design-system";
import { backgroundColor } from "./background-color";

describe("backgroundColor", (): void => {
    test("should opperate on designSystemDefaults if no design system is provided", (): void => {
        expect(backgroundColor({} as DesignSystem)).toBe(
            designSystemDefaults.backgroundColor
        );
    });
    test("should return the background color of the passed designSystem", (): void => {
        expect(backgroundColor({ backgroundColor: "#FF0" } as DesignSystem)).toBe("#FF0");
    });
});
