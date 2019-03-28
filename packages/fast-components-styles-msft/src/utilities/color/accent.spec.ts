import { accentSwatch } from "./accent";
import designSystemDefaults, { DesignSystem } from "../../design-system";
import { accentPaletteConfig } from "./color-constants";
import { parseColorHexRGB } from "@microsoft/fast-colors";

describe("accentSwatch", (): void => {
    test("should return #0078D4 by default", (): void => {
        expect(accentSwatch({} as DesignSystem)).toBe("#0078D4");
    });
    test("should return the middle of the accentPaletteSource", (): void => {
        expect(
            accentSwatch(
                Object.assign({}, designSystemDefaults, {
                    accentPaletteConfig: Object.assign({}, accentPaletteConfig, {
                        baseColor: parseColorHexRGB("#F2C812"),
                    }),
                })
            )
        ).toBe("#F2C812");
    });
});
