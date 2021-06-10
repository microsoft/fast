import { parseColorHexRGB } from "@microsoft/fast-colors";
import { expect } from "chai";
import { PaletteRGB } from "../color-vNext/palette";
import { SwatchRGB } from "../color-vNext/swatch";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import { accentForegroundCut_DEPRECATED, accentForegroundCutLarge_DEPRECATED } from "./accent-foreground-cut";
import { neutralBaseColor, accentBaseColor } from "./color-constants";
import { Swatch } from "./common";
import { foregroundOnAccent as foregroundOnAccentNew  } from '../color-vNext/recipes/foreground-on-accent';

describe("Cut text", (): void => {
    it("should return white by by default", (): void => {
        expect(accentForegroundCut_DEPRECATED(undefined as any)).to.equal("#FFFFFF");
        expect(accentForegroundCutLarge_DEPRECATED(undefined as any)).to.equal("#FFFFFF");
    });
    it("should return black when background does not meet contrast ratio", (): void => {
        expect(accentForegroundCut_DEPRECATED((): Swatch => "#FFF")({} as any)).to.equal("#000000");
        expect(accentForegroundCutLarge_DEPRECATED((): Swatch => "#FFF")({} as any)).to.equal(
            "#000000"
        );

        expect(
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            accentForegroundCut_DEPRECATED((designSystem: FASTDesignSystem) => "#FFF")(
                fastDesignSystemDefaults
            )
        ).to.equal("#000000");
        expect(
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            accentForegroundCutLarge_DEPRECATED((designSystem: FASTDesignSystem) => "#FFF")(
                fastDesignSystemDefaults
            )
        ).to.equal("#000000");
    });
});
describe("ensure parity between old and new recipe implementation", () => {
    const color = (parseColorHexRGB(accentBaseColor)!)
    const palette = PaletteRGB.create(SwatchRGB.create(color.r, color.g, color.b));
    it(
        `should be the same for ${palette.source.toColorString()}`,
        () => {
            expect(
                accentForegroundCut_DEPRECATED(
                    { ...fastDesignSystemDefaults, backgroundColor: fastDesignSystemDefaults.accentBaseColor }
                )
            ).to.be.equal(
                foregroundOnAccentNew(palette.source, 4.5).toColorString().toUpperCase()
            )
        }
    )
})