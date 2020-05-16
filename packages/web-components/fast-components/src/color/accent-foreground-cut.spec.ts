import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import { accentForegroundCut, accentForegroundCutLarge } from "./accent-foreground-cut";
import { Swatch } from "./common";
import { expect } from "chai";

describe("Cut text", (): void => {
    it("should return white by by default", (): void => {
        expect(accentForegroundCut(undefined as any)).to.equal("#FFFFFF");
        expect(accentForegroundCutLarge(undefined as any)).to.equal("#FFFFFF");
    });
    it("should return black when background does not meet contrast ratio", (): void => {
        expect(accentForegroundCut((): Swatch => "#FFF")({} as any)).to.equal("#000000");
        expect(accentForegroundCutLarge((): Swatch => "#FFF")({} as any)).to.equal(
            "#000000"
        );

        expect(
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            accentForegroundCut((designSystem: FASTDesignSystem) => "#FFF")(
                fastDesignSystemDefaults
            )
        ).to.equal("#000000");
        expect(
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            accentForegroundCutLarge((designSystem: FASTDesignSystem) => "#FFF")(
                fastDesignSystemDefaults
            )
        ).to.equal("#000000");
    });
});
