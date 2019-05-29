import { accentSwatch } from "./accent";
import designSystemDefaults, { DesignSystem } from "../../design-system";

describe("accentSwatch", (): void => {
    test("should return #0078D4 by default", (): void => {
        expect(accentSwatch({} as DesignSystem)).toBe("#0078D4");
    });
    test("should return base accent color by default with a different accent palette", (): void => {
        expect(
            accentSwatch(
                Object.assign({}, designSystemDefaults, {
                    accentPalette: ["#FFF", "#898989", "#000"],
                } as DesignSystem)
            )
        ).toBe("#0078D4");
    });
    test("should return the middle of the accent palette if no base accent color set", (): void => {
        expect(
            accentSwatch(
                Object.assign({}, designSystemDefaults, {
                    accentBaseColor: null,
                    accentPalette: ["#FFF", "#898989", "#000"],
                } as DesignSystem)
            )
        ).toBe("#898989");
    });
});
