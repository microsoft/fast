import { DesignSystem } from "src";
import { ColorHSL, hslToRGB, parseColor, rgbToHSL } from "@microsoft/fast-colors";
import { format } from "@microsoft/fast-jss-utilities";
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
import { accentFill } from ".";

function gradientSwatchRecipe<T extends SwatchFamily>(
    type: keyof T,
    callback: SwatchFamilyResolver<T>
): SwatchResolver {
    return (designSystem: DesignSystem): Swatch => {
        const baseRecipe: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<T>(
            type,
            callback
        );
        const color: Swatch = baseRecipe(designSystem);
        const colorHsl: ColorHSL = rgbToHSL(parseColor(color));
        let hShifted: number = colorHsl.h + 28;
        if (hShifted > 360) {
            hShifted -= 360;
        }
        const secondaryHsl: ColorHSL = ColorHSL.fromObject({
            h: hShifted,
            s: colorHsl.s,
            l: colorHsl.l,
        });
        return format(
            "linear-gradient(0deg, {0} 0%, {1} 100%)",
            (a: any): string => color,
            (a: any): string => hslToRGB(secondaryHsl).toStringHexRGB()
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
