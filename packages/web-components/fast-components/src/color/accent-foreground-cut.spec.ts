import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import { accentForegroundCut, accentForegroundCutLarge } from "./accent-foreground-cut";
import { Swatch } from "./common";

describe("Cut text", (): void => {
    test("should return white by by default", (): void => {
        expect(accentForegroundCut(undefined as any)).toBe("#FFFFFF");
        expect(accentForegroundCutLarge(undefined as any)).toBe("#FFFFFF");
    });
    test("should return black when background does not meet contrast ratio", (): void => {
        expect(accentForegroundCut((): Swatch => "#FFF")({} as any)).toBe("#000000");
        expect(accentForegroundCutLarge((): Swatch => "#FFF")({} as any)).toBe("#000000");

        expect(
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            accentForegroundCut((designSystem: FASTDesignSystem) => "#FFF")(
                fastDesignSystemDefaults
            )
        ).toBe("#000000");
        expect(
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            accentForegroundCutLarge((designSystem: FASTDesignSystem) => "#FFF")(
                fastDesignSystemDefaults
            )
        ).toBe("#000000");
    });
});
