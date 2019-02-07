import { accentSwatch } from "./accent";
import { DesignSystem } from "../../design-system";

describe("accentSwatch", (): void => {
    test("should return #0078D4 by default", (): void => {
        expect(accentSwatch({} as DesignSystem)).toBe("#0078D4");
    });
    test("should return the middle of the accentPaletteSource", (): void => {
        expect(
            accentSwatch({
                accentPaletteSource: ["#FFF", "#F2C812", "#000"],
            } as DesignSystem)
        ).toBe("#F2C812");
    });
});
