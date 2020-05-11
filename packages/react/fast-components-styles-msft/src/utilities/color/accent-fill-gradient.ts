import { ColorHSL, hslToRGB, parseColor, rgbToHSL } from "@microsoft/fast-colors";
import { format } from "@microsoft/fast-jss-utilities";
import { DesignSystem } from "../../design-system";
import {
    FillSwatchFamily,
    Swatch,
    SwatchFamily,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
    SwatchResolver,
} from "./common";
import { accentFill } from "./index";

function gradientSwatchRecipe<T extends SwatchFamily>(
    type: keyof T,
    callback: SwatchFamilyResolver<T>
): SwatchResolver {
    return (designSystem: DesignSystem): Swatch => {
        const baseRecipe: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<T>(
            type,
            callback
        );
        const baseColor: Swatch = baseRecipe(designSystem);
        const baseColorHSL: ColorHSL = rgbToHSL(parseColor(baseColor));
        let shiftedHue: number = baseColorHSL.h + 28;
        if (shiftedHue > 360) {
            shiftedHue -= 360;
        }
        const shiftedColor: Swatch = hslToRGB(
            ColorHSL.fromObject({
                h: shiftedHue,
                s: baseColorHSL.s,
                l: baseColorHSL.l,
            })
        ).toStringHexRGB();
        return format(
            "linear-gradient(0deg, {0} 0%, {1} 100%)",
            (a: any): string => baseColor,
            (a: any): string => shiftedColor
        )(designSystem);
    };
}

export const accentFillGradientRest: SwatchResolver = gradientSwatchRecipe<
    FillSwatchFamily
>(SwatchFamilyType.rest, accentFill);
export const accentFillGradientHover: SwatchResolver = gradientSwatchRecipe<
    FillSwatchFamily
>(SwatchFamilyType.hover, accentFill);
export const accentFillGradientActive: SwatchResolver = gradientSwatchRecipe<
    FillSwatchFamily
>(SwatchFamilyType.active, accentFill);
export const accentFillGradientFocus: SwatchResolver = gradientSwatchRecipe<
    FillSwatchFamily
>(SwatchFamilyType.focus, accentFill);
