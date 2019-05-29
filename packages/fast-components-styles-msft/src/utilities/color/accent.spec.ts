import { accentSwatch } from "./accent";
import designSystemDefaults, {
    DesignSystem,
    ensureDesignSystemDefaults,
} from "../../design-system";
import { accentPaletteConfig } from "./color-constants";
import { parseColorHexRGB } from "@microsoft/fast-colors";

describe("accentSwatch", (): void => {
    test("should return #0078D4 by default", (): void => {
        expect(accentSwatch({} as DesignSystem)).toBe("#0078D4");
    });
    xtest("should return the middle of the accentPaletteSource", (): void => {
        // TODO: turn back on when https://github.com/Microsoft/fast-dna/issues/1614 is fixed
        expect(
            accentSwatch(
                Object.assign({}, designSystemDefaults, {
                    accentPalette: ["#FFF", "#898989", "#000"],
                })
            )
        ).toBe("#898989");
    });
});
