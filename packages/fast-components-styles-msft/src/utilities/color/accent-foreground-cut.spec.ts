import { accentForegroundCut, accentForegroundCutLarge } from "./accent-foreground-cut";
import designSystemDefaults, { DesignSystem } from "../../design-system";

describe("Cut text", (): void => {
    test("should return white by by default", (): void => {
        expect(accentForegroundCut(undefined as any)).toBe("#FFFFFF");
        expect(accentForegroundCutLarge(undefined as any)).toBe("#FFFFFF");
    });
    test("should return black when background does not meet contrast ratio", (): void => {
        expect(
            accentForegroundCut({
                accentPaletteSource: ["#FFF", "#FFF"],
            } as DesignSystem)
        ).toBe("#000000");
        expect(
            accentForegroundCutLarge({
                accentPaletteSource: ["#FFF", "#FFF"],
            } as DesignSystem)
        ).toBe("#000000");

        expect(
            accentForegroundCut((designSystem: DesignSystem) => "#FFF")(
                designSystemDefaults
            )
        ).toBe("#000000");
        expect(
            accentForegroundCutLarge((designSystem: DesignSystem) => "#FFF")(
                designSystemDefaults
            )
        ).toBe("#000000");
    });
});
