import { PaletteRGB } from "../palette";
import { SwatchRGB } from "../swatch";
import { baseLayerLuminanceSwatch } from "../utilities/base-layer-luminance";

export function neutralLayer1(
    palette: PaletteRGB,
    baseLayerLuminance: number
): SwatchRGB {
    return palette.get(
        palette.closestIndexOf(baseLayerLuminanceSwatch(baseLayerLuminance))
    );
}
